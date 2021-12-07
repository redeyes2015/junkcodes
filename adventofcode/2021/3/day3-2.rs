use std::fs;
use std::cmp::Ordering;

type Picker = fn(&Vec<&[u8]>, usize) -> u8;
fn o2_picker(lines: &Vec<&[u8]>, idx: usize) -> u8 {
    let mut one: usize = 0;
    for l in lines {
        if l[idx] == b'1' {
            one += 1;
        }
    }

    let zero = lines.len() - one;
    return match one.cmp(&zero) {
        Ordering::Less => b'0',
        Ordering::Equal => b'1',
        Ordering::Greater => b'1',
    }
}
fn co2_picker(lines: &Vec<&[u8]>, idx: usize) -> u8 {
    if o2_picker(lines, idx) == b'1' {
        b'0'
    } else {
        b'1'
    }
}
fn process(lines: &mut Vec<&[u8]>, picker: Picker) -> i32 {
    let length = lines[0].len();
    for idx in 0..length {
        if lines.len() == 1 {
            break
        }
        let expect = picker(lines, idx);
        // thanks https://www.reddit.com/r/rust/comments/2u42oy/comment/co4x4n9/
        lines.retain(|l| l[idx] == expect);
    }
    let o2 = std::str::from_utf8(lines[0]).unwrap();
    i32::from_str_radix(o2, 2).unwrap()
}

fn main() {
    // let filename = "./test_input";
    let filename = "./input_3";
    let content = fs::read_to_string(filename).unwrap();
    let lines: Vec<&[u8]> = content.lines()
        .map(|l| l.as_bytes())
        .collect();

    let mut lines_o2 = lines.clone();
    let o2 = process(&mut lines_o2, o2_picker);
    let mut lines_co2 = lines.clone();
    let co2 = process(&mut lines_co2, co2_picker);

    println!("o2: {}, co2: {}, result: {}", o2, co2, o2 * co2);
}
