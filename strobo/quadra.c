#define _GNU_SOURCE
#include<sys/types.h>
#include<sys/wait.h>
#include<stdio.h>
#include<string.h>
#include<stdlib.h>
#include<pthread.h>

#define NUM_THREADS     7

//const static char *pair = "69";
static char *self = "018";
static char *set = "01689";

#ifdef NEED_COUNT
long long count = 0ll;
#endif

#define BUFF_MAX_LENGTH 16000
struct buff_t {
#ifdef NEED_OUTPUT
	char s[BUFF_MAX_LENGTH];
	char *tail;
	char *guard;
#endif
};

void output(int len, char *current, struct buff_t *buff){
#ifdef NEED_OUTPUT
	if ((buff->tail + len) > (buff->guard)){
		buff->tail = 0;
		printf("%s%s\n", buff->s, current);
		buff->tail = buff->s;
	}
	else {
		sprintf(buff->tail, "%s\n", current);
		buff->tail += (len + 1);
	}
#endif
}

struct work {
	int pos;
	int len;
	char current[32];
	struct buff_t buff;
};

long long recurs(int pos, int len, char *current, struct buff_t *buff){
	char *p;
	long long ret = 0ll;
	if(pos >= (len >> 1)){
		if(len & 1){
			for(p = self; *p; ++p){
				current[pos] = *p;
				output(len, current, buff);
				ret = 3ll;
			}
		}
		else {
			output(len, current, buff);
			ret = 1ll;
		}
		return ret;
	}
	if(pos) p = set;
	else p = set + 1;

	for(; *p; ++p){
		current[pos] = *p;
		switch(*p){
			case '1':
			case '8':
			case '0':
				current[len - 1 - pos] = *p;
				break;
			case '6':
				current[len - 1 - pos] = '9';
				break;
			case '9':
				current[len - 1 - pos] = '6';
				break;
		}
#ifdef NEED_COUNT
		ret +=
#endif
		recurs(pos + 1, len, current, buff);
	}

	return ret;
}
void *Worker(void *d){
	struct work *w = (struct work *)d;
#ifdef NEED_OUTPUT
	memset(w->buff.s, 0, BUFF_MAX_LENGTH);
	w->buff.tail = w->buff.s;
	w->buff.guard = &(w->buff.s[BUFF_MAX_LENGTH - 2]);
#endif

	long long c = recurs(w->pos, w->len, w->current, &(w->buff));

#ifdef NEED_COUNT
	__sync_fetch_and_add(&count, c);
#endif

#ifdef NEED_OUTPUT
	if(w->buff.s != w->buff.tail){
		printf("%s", w->buff.s);
	}
#endif
	pthread_exit (NULL);
}

void workon(int len){
	pthread_t threads[NUM_THREADS];
	struct work thread_args[NUM_THREADS];
	char *bruce[] = {
		"10", "11", "16", "18", "19",
		"60", "61", "66", "68", "69",
		"80", "81", "86", "88", "89",
		"90", "91", "96", "98", "99" };
	char *r_bruce[] = {
		"01", "11", "91", "81", "61",
		"09", "19", "99", "86", "69",
		"08", "18", "98", "88", "68",
		"06", "16", "96", "86", "66" };
	int i, next;

	for(i = 0; i < 20; ++i){
		next = i%NUM_THREADS;
		if(i >= NUM_THREADS) pthread_join(threads[next], NULL);
		else thread_args[next].current[len] = 0;
		thread_args[next].pos = 2;
		thread_args[next].len = len;
		thread_args[next].current[0] = bruce[i][0];
		thread_args[next].current[1] = bruce[i][1];
		thread_args[next].current[len - 2] = r_bruce[i][0];
		thread_args[next].current[len - 1] = r_bruce[i][1];
		pthread_create(&threads[next], NULL, Worker, (void *) &thread_args[next]);
	}

	for (i=0; i<NUM_THREADS; ++i) {
		pthread_join(threads[i], NULL);
	}
	return;
}

#ifndef MAX_LENGTH
#define MAX_LENGTH 25
#endif

int main() {
	int len;
	char stack[32];
	struct buff_t buff;

#ifdef NEED_OUTPUT
	memset(buff.s, 0, BUFF_MAX_LENGTH);
	buff.tail = buff.s;
	buff.guard = &(buff.s[BUFF_MAX_LENGTH - 2]);
#endif

	for(len = 1; len < 5; ++len){
		stack[len] = 0;
#ifdef NEED_COUNT
		count +=
#endif
		recurs(0, len, stack, &buff);
	}
#ifdef NEED_OUTPUT
	if(buff.tail != buff.s){
		*(buff.tail) = '\0';
		printf("%s", buff.s);
	}
#endif

	for(len = 5; len < MAX_LENGTH; ++len){
		workon(len);
	}

#ifdef NEED_COUNT
	printf("%lld\n", count);
#endif
	return 0;

}
