#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct transforms {
  char *from, *to;
  char *_buf;
} trans_t;

int main() {
  char buff[512];

  while (fgets(buff, sizeof(buff), stdin) > 1) {
    *(strchr(buff, '\n')) = NULL

  }
  
}
