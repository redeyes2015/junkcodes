use std::fs;

/*
 aaaa 
b    c
b    c
 dddd 
e    f
e    f
 gggg 

 a -> 1
 b -> 2
 c -> 4
 d -> 8
 e -> 16
 f -> 32
 g -> 64

 */

fn str_to_bits (s: &str) -> u8 {
    let mut n: u8 = 0;
    for b in s.as_bytes() {
        n |= match b {
            b'a' => 1,
            b'b' => 2,
            b'c' => 4,
            b'd' => 8,
            b'e' => 16,
            b'f' => 32,
            b'g' => 64,
            _ => 0,
        }
    }
    n
}

fn segs_to_num (b: u8) -> i32 {
    match b {
        119 => 0, // (127 - 8) => 0,
        36 => 1, // (4 | 32) => 1,
        93 => 2, // (1 | 4 | 8 | 16 | 64) => 2,
        109 => 3, // (1 | 4 | 8 | 32 | 64) => 3,
        46 => 4, // (2 | 4 | 8 | 32) => 4,
        107 => 5, // (1 | 2 | 8 | 32 | 64) => 5,
        123 => 6, // (127 - 4) => 6,
        37 => 7, // (1 | 4 | 32) => 7,
        127 => 8,
        111 => 9, // (127 - 16) => 9,
        _ => {
            println!("boo: {}", b);
            panic!("!!");
        },
    }
}

fn main() {
    let filename = "input-8";
    // let filename = "test_input";
    let input = fs::read_to_string(filename).unwrap();
    let entries: Vec<&str> = input.split_terminator('\n').collect();

    let onebits: [u8; 8] = [1, 2, 4, 8, 16, 32, 64, 127];

    let mut grand_sum: i32 = 0;
    for entry in entries {
        let (map, res) = entry.split_once(" | ").unwrap();
        let map: Vec<&str> = map.split(' ').collect();
        let mut one: Option<&str> = None;
        let mut four: Option<&str> = None;
        let mut seven: Option<&str> = None;
        let mut len5: Vec<&str> = vec![];
        let mut len6: Vec<&str> = vec![];
        for frag in &map {
            match frag.len() {
                2 => { one = Some(frag) }
                3 => { seven = Some(frag) }
                4 => { four = Some(frag) }
                5 => { len5.push(frag) }
                6 => { len6.push(frag) }
                _ => {}
            }
        }
        let one = str_to_bits(one.unwrap());
        let four = str_to_bits(four.unwrap());
        let seven = str_to_bits(seven.unwrap());
        let a = seven - one;
        let bd = four - one;
        let abcdf = four | a;
        let nine = len6
            .iter()
            .map(|frag| str_to_bits(&frag))
            .filter(
                |n| onebits.contains(&(n ^ abcdf))
                )
            .last()
            .unwrap();
        let g = nine - abcdf;
        let e = 127 - g - abcdf;
        let two = len5
            .iter()
            .map(|frag| str_to_bits(&frag))
            .filter(
                |n| (n - (n & nine)) != 0
                )
            .last()
            .unwrap();
        let c = two & one;
        let f = one & (127 ^ two);
        let d = bd & two;
        let b = bd & (127 ^ two);
        // println!("A: {}, B: {}, C: {}, D: {}, E: {}, F: {}, G: {}", a, b, c, d, e, f, g);

        let mut n: i32 = 0;
        for nums in res.split_whitespace() {
            let sig = str_to_bits(nums);
            let mut seg: u8 = 0;
            if (sig & a) != 0 { seg += 1 }
            if (sig & b) != 0 { seg += 2 }
            if (sig & c) != 0 { seg += 4 }
            if (sig & d) != 0 { seg += 8 }
            if (sig & e) != 0 { seg += 16 }
            if (sig & f) != 0 { seg += 32 }
            if (sig & g) != 0 { seg += 64 }

            n = n * 10 + segs_to_num(seg);
        }
        println!("{}", n);
        grand_sum += n;
    }
    println!("{}", grand_sum);
}
