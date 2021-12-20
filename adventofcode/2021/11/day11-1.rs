use std::fs;
use std::convert::TryInto;

fn dump_map(map: &Vec<Vec<u8>>) {
    for l in map {
        for v in l {
            print!("{}", v.to_string());
        }
        println!("");
    }
    println!("");
}

fn main() {
    // let filename = "test-input";
    let filename = "input-11";
    let input = fs::read_to_string(filename).unwrap();

    let mut map: Vec<Vec<u8>> = input
        .lines()
        .map(|l| l.as_bytes().iter().map(|&c| c - b'0').collect::<Vec<u8>>())
        .collect();
    // dump_map(&map);

    let width = map.len() - 1;
    let height = map[0].len() - 1;
    let w_i32: i32 = width.try_into().unwrap();
    let h_i32: i32 = height.try_into().unwrap();
    let adj: [(i32, i32); 8] = [
        (1, 1),
        (0, 1),
        (1, 0),
        (-1, -1),
        (0, -1),
        (-1, 0),
        (-1, 1),
        (1, -1),
    ];
    let mut flashes: usize = 0;
    for _step in 0..100 {
        for i in 0..=width {
            for j in 0..=height {
                if map[i][j] >= 10 {
                    continue;
                }
                map[i][j] += 1;
                if map[i][j] < 10 {
                    continue;
                }
                let mut stack: Vec<(usize, usize)> = vec![(i, j)];
                while stack.len() > 0 {
                    let (i2, j2) = stack.pop().unwrap();
                    let (i2, j2): (i32, i32) = (i2.try_into().unwrap(), j2.try_into().unwrap());
                    for (di, dj) in adj {
                        let (x, y) = (di + i2, dj + j2);
                        if x.clamp(0, w_i32) != x || y.clamp(0, h_i32) != y {
                            continue;
                        }
                        let (x, y): (usize, usize) = (
                            x.try_into().unwrap(),
                            y.try_into().unwrap()
                            );
                        if map[x][y] >= 10 {
                            continue;
                        }
                        map[x][y] += 1;
                        if map[x][y] >= 10 {
                            stack.push((x, y));
                        }
                    }
                }
            }
        }
        for i in 0..=width {
            for j in 0..=height {
                if map[i][j] >= 10 {
                    flashes += 1;
                    map[i][j] = 0;
                }
            }
        }
        // dump_map(&map);
    }
    dump_map(&map);
    println!("{}", flashes);
}
