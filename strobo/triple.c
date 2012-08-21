#define _GNU_SOURCE
#include<sys/types.h>
#include<sys/wait.h>
#include<stdio.h>
#include<string.h>
#include<stdlib.h>
#include<pthread.h>

//const static char *pair = "69";
static char *self = "018";
static char *set = "01689";

int count = 0;

pthread_mutex_t output_mutex;
void real_output(int len, char *current){
	int mid = len >> 1,
		tail = len - 1,
		i;
	char c;
	for(i = 0; i <= mid; ++i){
		switch(current[i]){
			case '0':
				c = '0';
				break;
			case '1':
				c = '1';
				break;
			case '8':
				c = '8';
				break;
			case '6':
				c = '9';
				break;
			case '9':
				c = '6';
				break;
		}
		current[tail - i] = c;
	}
	current[len] = 0;

	//pthread_mutex_lock(&output_mutex);
	__sync_fetch_and_add(&count, 1);
	//pthread_mutex_unlock(&output_mutex);
	/*
	pthread_mutex_lock(&output_mutex);
	printf("%s\n", current);
	pthread_mutex_unlock(&output_mutex);
	*/
}


#define NUM_THREADS     12
struct output_work {
	int vacant;
	int len;
	char current[32];
};

struct output_workerbox {
	struct output_work work;
	pthread_mutex_t work_mutex;
	pthread_cond_t work_available_cond;
};

void *output_worker(void *d){
	struct output_workerbox *box = (struct output_workerbox *)d;
	struct output_work *work = &(box->work);
	pthread_mutex_t *mx = &(box->work_mutex);
	pthread_cond_t *work_available = &(box->work_available_cond);

	pthread_mutex_lock(mx);
	if(work->vacant){
		pthread_cond_wait(work_available, mx);
	}
	while(work->len > 0){
		real_output(work->len, work->current);
		work->vacant = 1;
		pthread_cond_signal(work_available);
		pthread_cond_wait(work_available, mx);
	}
	pthread_cond_signal(work_available);
	pthread_mutex_unlock(mx);
	pthread_exit(NULL);
}

void broker_send_work(struct output_workerbox *box, int len, char *current){
	pthread_mutex_lock(&(box->work_mutex));
	if(!box->work.vacant){
		pthread_cond_wait(
				&(box->work_available_cond),
				&(box->work_mutex));
	}
	box->work.vacant = 0;
	box->work.len = len;
	memcpy(box->work.current, current, 32);
	
	pthread_cond_signal(&(box->work_available_cond));
	pthread_mutex_unlock(&(box->work_mutex));
}

struct output_work broker_workbox;
pthread_mutex_t broker_workbox_mutex;
pthread_cond_t broker_available_cond;

void *output_broker(void *d){
	struct output_workerbox workerboxes[NUM_THREADS];
	pthread_t output_worker_thread[NUM_THREADS];
	int i;

	for(i = 0; i < NUM_THREADS; ++i){
		pthread_mutex_init(&(workerboxes[i].work_mutex), NULL);
		pthread_cond_init(&(workerboxes[i].work_available_cond), NULL);
		workerboxes[i].work.vacant = 1;
		pthread_create(&output_worker_thread[i], NULL, output_worker, &workerboxes[i]);
	}

	pthread_mutex_lock(&broker_workbox_mutex);
	if(broker_workbox.vacant){
		pthread_cond_wait(&broker_available_cond, &broker_workbox_mutex);
	}

	i = 0;
	while(broker_workbox.len > 0){
		//real_output(broker_workbox.len, broker_workbox.current);
		i = (i + 1) % NUM_THREADS;
		broker_send_work(&(workerboxes[i]), broker_workbox.len,
				broker_workbox.current);

		broker_workbox.vacant = 1;
		pthread_cond_broadcast(&broker_available_cond);
		pthread_cond_wait(&broker_available_cond, &broker_workbox_mutex);
	}

	pthread_cond_signal(&broker_available_cond);
	pthread_mutex_unlock(&broker_workbox_mutex);

	for(i = 0; i < NUM_THREADS; ++i) {
		broker_send_work(&workerboxes[i], -1, broker_workbox.current);
	}
	for(i = 0; i < NUM_THREADS; ++i) {
		pthread_join(output_worker_thread[i], NULL);
	}

	pthread_exit(NULL);
}

void output(int len, char *current){
	pthread_mutex_lock(&broker_workbox_mutex);
	while(!broker_workbox.vacant){
		pthread_cond_wait(&broker_available_cond, &broker_workbox_mutex);
	}
	broker_workbox.vacant = 0;
	broker_workbox.len = len;
	memcpy(broker_workbox.current, current, 32);

	pthread_cond_signal(&broker_available_cond);
	pthread_mutex_unlock(&broker_workbox_mutex);
}

struct work {
	int pos;
	int len;
	char current[32];
};

void recurs(int pos, int len, char *current){
	char *p;
	if(pos >= (len >> 1)){
		if(len & 1){
			for(p = self; *p; ++p){
				current[pos] = *p;
				real_output(len, current);
			}
		}
		else {
			real_output(len, current);
		}
		return;
	}
	if(pos) p = set;
	else p = set + 1;

	for(; *p; ++p){
		current[pos] = *p;
		recurs(pos + 1, len, current);
	}

	return;
}
void *Worker(void *d){
	struct work *w = (struct work *)d;
	recurs(w->pos, w->len, w->current);
	pthread_exit (NULL);
}

void workon(int len){
	pthread_t threads[6];
	struct work thread_args[6];
	char *bruce[] = {
		"10", "11", "16", "18", "19",
		"60", "61", "66", "68", "69",
		"80", "81", "86", "88", "89",
		"90", "91", "96", "98", "99" };
	int i, next;

	for(i=0; i<6; ++i){
		thread_args[i].pos = 2;
		thread_args[i].len = len;
		thread_args[i].current[0] = bruce[i][0];
		thread_args[i].current[1] = bruce[i][1];
		pthread_create(&threads[i], NULL, Worker, (void *) &thread_args[i]);
	}
	while(i < 20){
		next = i%6;
		pthread_join(threads[next], NULL);
		thread_args[next].pos = 2;
		thread_args[next].len = len;
		thread_args[next].current[0] = bruce[i][0];
		thread_args[next].current[1] = bruce[i][1];
		pthread_create(&threads[next], NULL, Worker, (void *) &thread_args[next]);
		++i;
	}

	for (i=0; i<6; ++i) {
		pthread_join(threads[i], NULL);
	}
	return;
}

int main() {
	int len;
	char stack[32];
	pthread_t broker_thread;

	pthread_mutex_init(&output_mutex, NULL);
	pthread_mutex_init(&broker_workbox_mutex, NULL);
	pthread_cond_init(&broker_available_cond, NULL);

	broker_workbox.vacant = 1;
	pthread_create(&broker_thread, NULL, output_broker, NULL);


	/*
	for(len = 1; len < 15; ++len)
		recurs(0, len, stack);
	*/

	recurs(0, 1, stack);
	recurs(0, 2, stack);
	recurs(0, 3, stack);
	recurs(0, 4, stack);
	for(len = 5; len < 22; ++len){
		workon(len);
	}

	output(-1, stack);
	pthread_join(broker_thread, NULL);

	printf("%d\n", count);
	return 0;

}
