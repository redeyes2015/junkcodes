#include<stdio.h>
#include<stdlib.h>
#include<string.h>

typedef struct mem_vec {
  unsigned char *s;
  int l;
} MemVec;

void traverse(MemVec *s_in, MemVec *s_out) {
  s_out->s = realloc(s_out->s, s_in->l * 2);

  unsigned char curC = s_in->s[0];
  unsigned char curL = 1;
  unsigned char *output = s_out->s;
  int output_l = 0;
  unsigned char *input;
  unsigned char c;
  
  for (input = s_in->s + 1; (c = *input) != 0; ++input) {
    if (c == curC) {
      curL += 1;
    }
    else {
      output[0] = curL;
      output[1] = curC;
      output += 2;
      output_l += 2;
      curL = 1;
      curC = c;
    }
  }
  output[0] = curL;
  output[1] = curC;
  output[2] = 0;
  s_out->l = output_l + 2;
}

int main() {
  // 3113322113
  unsigned char *s0 = malloc(10);
  s0[0] = 3;
  s0[1] = 1;
  s0[2] = 1;
  s0[3] = 3;
  s0[4] = 3;
  s0[5] = 2;
  s0[6] = 2;
  s0[7] = 1;
  s0[8] = 1;
  s0[9] = 3;
  MemVec s1 = {s0, 1};
  MemVec s2 = {NULL, 0};
  MemVec *s_in = &s1;
  MemVec *s_out = &s2;
  MemVec *s_temp = NULL;

  int i;
  unsigned char *c;
  for (i = 0; i < 50; ++i) {
    traverse(s_in, s_out);
    printf("%d: ", i);
    /*
    for (c = s_out->s; *c != 0; ++c) {
      printf("%d", (unsigned int) *c);
    }
    */
    printf("%d\n", s_out->l);

    s_temp = s_in;
    s_in = s_out;
    s_out = s_temp;
  }
}
