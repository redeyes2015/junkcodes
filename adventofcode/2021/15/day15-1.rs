use std::fs;

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
    let mut traverse = vec![vec![i32::MAX; cols]; rows];
    let mut queue = vec![(0usize, 0usize)];
    traverse[0][0] = 0;
    while queue.len() > 0 {
        let mut next_queue = vec![];

        for (x, y) in queue {
            let risk = traverse[x][y];
            if x > 0 {
                let next_risk = risk + map[x - 1][y];
                if traverse[x - 1][y] > next_risk {
                    traverse[x - 1][y] = next_risk;
                    next_queue.push((x - 1, y));
                }
            }
            if x + 1 < rows {
                let next_risk = risk + map[x + 1][y];
                if traverse[x + 1][y] > next_risk {
                    traverse[x + 1][y] = next_risk;
                    next_queue.push((x + 1, y));
                }
            }
            if y > 0 {
                let next_risk = risk + map[x][y - 1];
                if traverse[x][y - 1] > next_risk {
                    traverse[x][y - 1] = next_risk;
                    next_queue.push((x, y - 1));
                }
            }
            if y + 1 < cols {
                let next_risk = risk + map[x][y + 1];
                if traverse[x][y + 1] > next_risk {
                    traverse[x][y + 1] = next_risk;
                    next_queue.push((x, y + 1));
                }
            }
        }

        // println!("{:?}", next_queue);
        queue = next_queue;
    }
    println!("{:?}", traverse[rows - 1][cols - 1]);
}
