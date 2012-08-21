#include<stdio.h>
#include<string.h>

/*
#define NEED_OUTPUT
#define NEED_COUNT
*/

//const static char *pair = "69";
static char *self = "018";
static char *set = "01689";

#ifdef NEED_COUNT
long long count = 0;
#endif

void output(int len, char *current){
#ifdef NEED_OUTPUT
    printf("%s\n", current);
#endif
#ifdef NEED_COUNT
	__sync_fetch_and_add(&count, 1ll);
#endif
}

void recurs(int pos, int len, char *current){
	char *p;
	if(pos >= (len >> 1)){
		if(len & 1){
			for(p = self; *p; ++p){
				current[pos] = *p;
				output(len, current);
			}
		}
		else {
			output(len, current);
		}
		return;
	}
	if(pos) p = set;
	else p = set + 1;

	for(; *p; ++p){
		switch(*p){
			case '0':
			case '1':
			case '8':
				current[len - 1 - pos] = *p;
				break;
			case '6':
				current[len - 1 - pos] = '9';
				break;
			case '9':
				current[len - 1 - pos] = '6';
				break;
		}
		current[pos] = *p;
		recurs(pos + 1, len, current);
	}
	return;
}

#ifndef MAX_LENGTH
#define MAX_LENGTH 25
#endif

int main()
{
	int i;
	char stack[32];
	for(i = 1; i < MAX_LENGTH; ++i){
		stack[i] = 0;
		recurs(0, i, stack);
	}

#ifdef NEED_COUNT
	printf("%lld\n", count);
#endif
	return 0;
}
