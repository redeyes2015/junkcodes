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

    let fold_line = folds.lines().nth(0).unwrap();
    let parts = fold_line.split_once("=").unwrap();
    let axis = parts.0.chars().last().unwrap();
    let value: i32 = parts.1.parse().unwrap();

    println!("axis: {}, value: {}, #(dots): {}", axis, value, map.len());

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
    println!("#(next_map): {}", next_map.len());
}
