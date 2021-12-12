use std::fs;

fn main() {
    // let filename = "./test-input";
    let filename = "./input-9";
    let input = fs::read_to_string(filename).unwrap();

    let map: Vec<Vec<u8>> = input
        .lines()
        .map(|l| l.as_bytes().iter().map(|&c| c - b'0').collect())
        .collect();
    let mut seen: Vec<Vec<bool>> = map
        .iter()
        .map(|l| l.iter().map(|_| false).collect())
        .collect();
    let mut sizes: Vec<usize> = Vec::new();

    for (i, l) in map.iter().enumerate() {
        for (j, &c) in l.iter().enumerate() {
            if seen[i][j] || c == 9 {
                continue;
            }
            let mut basin_size: usize = 0;
            let mut stack: Vec<(usize, usize)> = vec![(i, j)];
            while stack.len() > 0 {
                let (x, y) = stack.pop().unwrap();
                if seen[x][y] || map[x][y] == 9 {
                    continue;
                }
                seen[x][y] = true;
                basin_size += 1;
                if x > 0 {
                    stack.push((x - 1, y));
                }
                if (x + 1) < map.len() {
                    stack.push((x + 1, y));
                }
                if y > 0 {
                    stack.push((x, y - 1));
                }
                if (y + 1) < l.len() {
                    stack.push((x, y + 1));
                }
            }
            sizes.push(basin_size);
        }
    }
    sizes.sort();
    let ans: usize = sizes.iter().rev().take(3).copied().product();
    println!("{}", ans);
}
