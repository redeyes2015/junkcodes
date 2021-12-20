use std::fs;
use std::convert::TryFrom;

fn wrapped_get(map: &Vec<Vec<i32>>, x: usize, y: usize) -> i32 {
    let row = &map[x % map.len()];
    let origin = row[y % row.len()];
    let row_diff = i32::try_from(x / map.len()).unwrap();
    let col_diff = i32::try_from(y / row.len()).unwrap();
    if row_diff + col_diff == 0 {
        return origin;
    }
    return (origin - 1 + row_diff + col_diff) % 9 + 1;
}

fn main() {
    // let filename = "test-input";
    let filename = "input-15";
    let input = fs::read_to_string(filename).unwrap();

    let mut map: Vec<Vec<i32>> = Vec::new();
    for row in input.lines() {
        let mut map_row: Vec<i32> = Vec::new();
        for b in row.as_bytes() {
            map_row.push(i32::from(b - b'0'));
        }
        map.push(map_row);
    }
    let rows = map.len();
    let cols = map[0].len();
    let mut traverse = vec![vec![i32::MAX; cols * 5]; rows * 5];
    let mut queue = vec![(0usize, 0usize)];
    traverse[0][0] = 0;
    while queue.len() > 0 {
        let mut next_queue = vec![];

        for (x, y) in queue {
            let risk = traverse[x][y];
            if x > 0 {
                let next_risk = risk + wrapped_get(&map, x - 1, y);
                if traverse[x - 1][y] > next_risk {
                    traverse[x - 1][y] = next_risk;
                    next_queue.push((x - 1, y));
                }
            }
            if x + 1 < rows * 5 {
                let next_risk = risk + wrapped_get(&map, x + 1, y);
                if traverse[x + 1][y] > next_risk {
                    traverse[x + 1][y] = next_risk;
                    next_queue.push((x + 1, y));
                }
            }
            if y > 0 {
                let next_risk = risk + wrapped_get(&map, x, y - 1);
                if traverse[x][y - 1] > next_risk {
                    traverse[x][y - 1] = next_risk;
                    next_queue.push((x, y - 1));
                }
            }
            if y + 1 < cols * 5 {
                let next_risk = risk + wrapped_get(&map, x, y + 1);
                if traverse[x][y + 1] > next_risk {
                    traverse[x][y + 1] = next_risk;
                    next_queue.push((x, y + 1));
                }
            }
        }

        queue = next_queue;
    }

    println!("{:?}", traverse[rows * 5 - 1][cols * 5 - 1]);
}
