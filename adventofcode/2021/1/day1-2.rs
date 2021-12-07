use std::fs;

fn increases (ns: Vec<i32>) -> i32 {
    let mut c = 0;
    for i in 1..ns.len() {
        if ns[i - 1] < ns[i] {
            c += 1
        }
    }
    c
}

fn main() {
    let content = fs::read_to_string("./day1.input") 
        .expect("error reading input...");
    let ns: Vec<i32> = content.split_whitespace()
        .map(|s| s.parse().expect("parse error"))
        .collect();

    let ws: Vec<i32> = ns.windows(3)
        // .map(|w| w.into_iter().fold(0, |acc, c| acc + c))
        .map(|w| w.into_iter().fold(0, |acc, c| acc + c))
        .collect::<Vec<_>>();
    println!("increases of ws: {}", increases(ws));
}
