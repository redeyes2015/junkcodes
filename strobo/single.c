#include<stdio.h>
#include<string.h>

//const static char *pair = "69";
static char *self = "018";
static char *set = "01689";

long long count = 0;
void output(int len, char *current){
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
    //printf("%s\n", current);
	__sync_fetch_and_add(&count, 1ll);
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
	current[pos] = *p;
	recurs(pos + 1, len, current);
    }
    return;
}

int main()
{
    int i;
    char stack[32];
    for(i = 1; i < 21; ++i)
	recurs(0, i, stack);

	printf("%lld\n", count);
    return 0;
}
