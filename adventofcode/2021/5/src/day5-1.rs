use std::fs;
use std::collections::HashMap;
use regex::Regex;

fn main () {
    // let filename = "./test_input";
    let filename = "./input-5";
    let content = fs::read_to_string(filename).unwrap();

    let mut map: HashMap<(i32, i32), i32> = HashMap::new();
    let re = Regex::new(r"^(\d+),(\d+) -> (\d+),(\d+)$").unwrap();
    let mut max_x: i32 = 0;
    let mut max_y: i32 = 0;
    for l in content.lines() {
        let caps = re.captures(l).unwrap();
        let caps: Vec<i32> = caps
            .iter()
            .skip(1)
            .map(|s| s.unwrap().as_str().parse().unwrap())
            .collect();
        let x1 = caps[0];
        let y1 = caps[1];
        let x2 = caps[2];
        let y2 = caps[3];
        if x1 != x2 && y1 != y2 {
            continue;
        }
        let (left, right) = (x1.min(x2), x1.max(x2));
        let (top, bottom) = (y1.min(y2), y1.max(y2));

        for x in left..(right + 1) {
            for y in top..(bottom + 1) {
                let coord = (x, y);
                let v = match map.get(&coord) {
                    Some(&v) => v,
                    None => 0,
                };
                map.insert((x, y), v + 1);
            }
        }

        if right > max_x {
            max_x = right;
        }
        if bottom > max_y {
            max_y = bottom;
        }
    }
    /*
    for x in 0..(max_x + 1) {
        for y in 0..(max_y + 1) {
            match map.get(&(x, y)) {
                Some(&v) => print!("{}", v),
                None => print!("."),
            }
        }
        println!("");
    }
    */
    println!("max: ({}, {})", max_x, max_y);
    println!("{}", map.values().filter(|&&v| v > 1).count());
}
