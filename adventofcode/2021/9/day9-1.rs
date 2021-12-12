use std::fs;

fn main() {
    // let filename = "./test-input";
    let filename = "./input-9";
    let input = fs::read_to_string(filename).unwrap();

    let map: Vec<Vec<u8>> = input
        .lines()
        .map(|l| l.as_bytes().iter().map(|&c| c - b'0').collect())
        .collect();
    let mut sum: i32 = 0;
    for (i, l) in map.iter().enumerate() {
        for (j, &c) in l.iter().enumerate() {
            if i > 0 && map[i - 1][j] <= c {
                continue;
            }
            if (i + 1) < map.len() && map[i + 1][j] <= c {
                continue;
            }
            if j > 0 && l[j - 1] <= c {
                continue;
            }
            if (j + 1) < l.len() && l[j + 1] <= c {
                continue;
            }
            sum += 1 + i32::from(c);
        }
    }
    println!("{:?}", sum);
}
