use std::fs;

fn main() {
    // let filename = "./test_input";
    let filename = "./input_3";
    let content = fs::read_to_string(filename).unwrap();
    let mut slots: Vec<i32> = vec![];
    let mut line_count = 0;
    for l in content.lines() {
        line_count += 1;
        for (i, c) in l.char_indices() {
            if i >= slots.len() {
                slots.push(0)
            }
            if c == '1' {
                slots[i] += 1;
            }
        }
    }
    let mut gamma = 0;
    let mut epsilon = 0;
    for g in slots {
        gamma *= 2;
        epsilon *= 2;
        let e = line_count - g;
        if g > e {
            gamma += 1;
        } else {
            epsilon += 1;
        }
    }
    println!("{}", gamma * epsilon)

}
