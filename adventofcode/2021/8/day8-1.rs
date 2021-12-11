use std::fs;

fn main() {
    let filename = "input-8";
    // let filename = "test_input";
    let input = fs::read_to_string(filename).unwrap();
    let entries: Vec<&str> = input.split_terminator('\n').collect();

    let c = entries
        .iter()
        .map(|e| e.split_once(" | ").unwrap())
        .map(|(_l, r)| r)
        .flat_map(|rs| rs.split_whitespace())
        .filter(|r| r.len() == 2 || r.len() == 3 || r.len() == 4 || r.len() == 7)
        .count();
    println!("{}", c);
}
