use std::fs;

fn main() {
    // let filename = "./test_input";
    let filename = "./input_2";
    let content = fs::read_to_string(filename)
        .unwrap();
    let mut depth = 0;
    let mut horizontal = 0;
    let mut aim = 0;
    for l in content.lines() {
        match l.split_once(' ') {
            None => break,
            Some((c, v)) => {
                let v: i32 = v.parse().unwrap();
                match c {
                    "forward" => {
                        depth += aim * v;
                        horizontal += v;
                    }
                    "down" => aim += v,
                    "up" => aim -= v,
                    _ => break
                }
            }
        }
    }


    println!("{}", depth * horizontal);
}
