use std::fs;
use std::collections::HashSet;

fn main() {
    // let filename = "./test-input";
    let filename = "./input-13";
    let input = fs::read_to_string(filename).unwrap();

    let (dots, folds) = input.split_once("\n\n").unwrap();

    let mut map: HashSet<(i32, i32)> = HashSet::new();
    for dot_line in dots.lines() {
        let (x, y) = dot_line.split_once(",").unwrap();
        let x: i32 = x.parse().unwrap();
        let y: i32 = y.parse().unwrap();
        map.insert((x, y));
    }

    for fold_line in folds.lines() {
        let parts = fold_line.split_once("=").unwrap();
        let axis = parts.0.chars().last().unwrap();
        let value: i32 = parts.1.parse().unwrap();

        let mut next_map: HashSet<(i32, i32)> = HashSet::new();
        for dot in map {
            let (mut x, mut y) = dot;
            if axis == 'x' && x > value {
                x = value + value - x;
            } else if axis == 'y' && y > value {
                y = value + value - y;
            }
            next_map.insert((x, y));
        }
        // println!("axis: {}, value: {}, #(next_map): {}", axis, value, next_map.len());
        map = next_map;
    }
    let mut max_x: i32 = 0;
    let mut max_y: i32 = 0;
    for (x, y) in map.iter() {
        max_x = max_x.max(*x);
        max_y = max_y.max(*y);
    }
    for y in 0..=max_y {
        for x in 0..=max_x {
            if map.contains(&(x, y)) {
                print!("#");
            } else {
                print!(".");
            }
        }
        println!("");
    }
}
