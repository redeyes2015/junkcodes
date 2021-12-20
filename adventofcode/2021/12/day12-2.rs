use std::fs;
use std::collections::HashMap;

fn dfs(map: &HashMap<&str, Vec<&str>>, cave: &str, path: &mut Vec<String>, twiced: bool) -> usize {
    if cave == "end" {
        // println!("{:?}", path);
        return 1;
    }
    let cave_dupe = String::from(cave);
    let is_small_cave = cave.chars().nth(0).unwrap().is_ascii_lowercase() ;
    let this_twice = is_small_cave && path.contains(&cave_dupe);
    if twiced && this_twice {
        return 0;
    }
    let twiced = twiced || this_twice;
    path.push(cave_dupe);
    let neighbors = map.get(&cave).unwrap();
    let mut sum: usize = 0;
    for next in neighbors {
        sum += dfs(map, next, path, twiced);
    }
    path.pop();
    return sum;
}

fn main() {
    // let filename = "test-input";
    let filename = "input-12";
    let input = fs::read_to_string(filename).unwrap();

    let mut map = HashMap::new();
    for l in input.lines() {
        let (from, to): (&str, &str) = l.split_once('-').unwrap();
        if to != "start" {
            map.entry(from).or_insert(Vec::new()).push(to);
        }
        if from != "start" {
            map.entry(to).or_insert(Vec::new()).push(from);
        }
    }
    let map = map;
    println!("{:?}", map);

    let mut path: Vec<String> = Vec::new();
    println!("{}", dfs(&map, "start", &mut path, false));
}
