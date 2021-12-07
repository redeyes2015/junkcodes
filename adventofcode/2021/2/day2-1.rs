use std::fs;

fn main() {
    // let filename = "./test_input";
    let filename = "./input_2";
    let content = fs::read_to_string(filename)
        .unwrap();
    let mut depth = 0;
    let mut horizontal = 0;
    for l in content.lines() {
        match l.split_once(' ') {
            None => {
                break
            }
            Some((c, v)) => {
                let v: i32 = v.parse().unwrap();
                match c {
                    "forward" => { horizontal += v }
                    "down" => { depth += v }
                    "up" => { depth -= v }
                    _ => break
                }
            }
        }
    }


    println!("{}", depth * horizontal);
}
