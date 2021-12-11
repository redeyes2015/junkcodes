use std::fs;

fn main() {
    let filename = "./input-7";
    let input = fs::read_to_string(filename).unwrap();
    // let input = "16,1,2,0,4,2,7,1,2,14";
    let ns: Vec<i32> = input
        .trim()
        .split(',')
        .map(|s| s.parse().unwrap())
        .collect();

    let min = ns.iter().fold(i32::MAX, |min, &n| min.min(n));
    let max = ns.iter().fold(i32::MIN, |max, &n| max.max(n));

    let mut res = min - 1;
    let mut min_sum = i32::MAX;
    for v in min..=max {
        let sum = ns.iter().map(|n| (1 + (v - n).abs()) * (v - n).abs() / 2).sum();
        if sum < min_sum {
            min_sum = sum;
            res = v;
        }
    }

    println!("{}, {}", res, min_sum)
}
