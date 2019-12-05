#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>

#define PLATE_SIZE 100000000

int main () {
  uint64_t target = 36000000ll;
  uint64_t *plate = (uint64_t *)malloc(sizeof(uint64_t) * PLATE_SIZE);

  memset(plate, 0, sizeof(uint64_t) * PLATE_SIZE);

  int i = 1;
  int watchPoint = 100000;

  for (; i < PLATE_SIZE; i++) {
    if (i > watchPoint) {
      printf("check %d\n", i);
      watchPoint += 100000;
    }
    int giftToGive = i * 11;
    plate[i] += giftToGive;
    if (plate[i] >= target) {
      printf("get it! %d\n", i);
      break;
    }
    int j = i + i;
    int times = 2;
    for (; times <= 50 && j < PLATE_SIZE; j += i, times += 1) {
      plate[j] += giftToGive;
    }
  }

  if (i == PLATE_SIZE) {
    printf("foo...\n");
  }

  return 0;
}
