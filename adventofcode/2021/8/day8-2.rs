use std::fs;
use std::collections::HashMap;
use std::collections::HashSet;

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

 A: d, B: a, C: b, D: c, E: g, F: f, G: e

!! cefdb, 103
   DGFAC 8|32|64|1|4
   109
   
 */

fn main() {
    let filename = "input-8";
    // let filename = "test_input";
    let input = fs::read_to_string(filename).unwrap();
    let entries: Vec<&str> = input.split_terminator('\n').collect();

    let mut bits_to_num: HashMap<u8, i32> = HashMap::new();
    bits_to_num.insert(127 - 8, 0);
    bits_to_num.insert(4 | 32, 1);
    bits_to_num.insert(1 | 4 | 8 | 16 | 64, 2);
    bits_to_num.insert(1 | 4 | 8 | 32 | 64, 3);
    bits_to_num.insert(2 | 4 | 8 | 32, 4);
    bits_to_num.insert(1 | 2 | 8 | 32 | 64, 5);
    bits_to_num.insert(127 - 4, 6);
    bits_to_num.insert(1 | 4 | 32, 7);
    bits_to_num.insert(127, 8);
    bits_to_num.insert(127 - 16, 9);
    let bits_to_num = bits_to_num;

    let mut grand_sum: i32 = 0;
    for entry in entries {
        let (map, res) = entry.split_once(" | ").unwrap();
        let map: Vec<&str> = map.split(' ').collect();
        let mut one: Option<&str> = None;
        let mut four: Option<&str> = None;
        let mut seven: Option<&str> = None;
        let mut eight: Option<&str> = None;
        let mut len5: Vec<&str> = vec![];
        let mut len6: Vec<&str> = vec![];
        for frag in &map {
            match frag.len() {
                2 => { one = Some(frag) }
                3 => { seven = Some(frag) }
                4 => { four = Some(frag) }
                5 => { len5.push(frag) }
                6 => { len6.push(frag) }
                7 => { eight = Some(frag) }
                _ => {}
            }
        }
        let one: HashSet<char> = one.unwrap().chars().collect();
        let four: HashSet<char> = four.unwrap().chars().collect();
        let seven: HashSet<char> = seven.unwrap().chars().collect();
        let eight: HashSet<char> = eight.unwrap().chars().collect();
        let a = &seven - &one;
        let bd = &four - &one;
        let abcdf = &four | &a;
        let nine = len6
            .iter()
            .filter(
                |frag| frag.chars().filter(|c| !abcdf.contains(c)).count() == 1
                )
            .last()
            .unwrap();
        let nine: HashSet<char> = nine.chars().collect();
        let g = &nine - &abcdf;
        let e = &(&eight - &g) - &abcdf;

        let two = len5
            .iter()
            .filter(
                |frag| frag.chars().any(|c| !nine.contains(&c))
                )
            .last()
            .unwrap();
        let (c, f): (HashSet<char>, HashSet<char>) = one
                     .iter()
                     .partition(|&&c| two.contains(c));
        let (d, b): (HashSet<char>, HashSet<char>) = bd
                     .iter()
                     .partition(|&&c| two.contains(c));
        let b = *b.iter().last().unwrap();
        let d = *d.iter().last().unwrap();
        let c = *c.iter().last().unwrap();
        let f = *f.iter().last().unwrap();
        let a = *a.iter().last().unwrap();
        let e = *e.iter().last().unwrap();
        let g = *g.iter().last().unwrap();
        // println!("A: {}, B: {}, C: {}, D: {}, E: {}, F: {}, G: {}", a, b, c, d, e, f, g);

        let mut char2bits: HashMap<char, u8> = HashMap::new();
        char2bits.insert(a, 1);
        char2bits.insert(b, 2);
        char2bits.insert(c, 4);
        char2bits.insert(d, 8);
        char2bits.insert(e, 16);
        char2bits.insert(f, 32);
        char2bits.insert(g, 64);
        // println!("{:?}", char2bits);
        
        let mut n: i32 = 0;
        for nums in res.split_whitespace() {
            let mut bits: u8 = 0;
            for c in nums.chars() {
                bits = bits | char2bits.get(&c).unwrap();
            }
            match bits_to_num.get(&bits) {
                Some(d) => {
                    // print!("{}", d);
                    n = n * 10 + d;
                }
                None => {
                    println!("!! {}, {}", nums, bits);
                }
            }
        }
        // println!("");
        grand_sum += n
    }
    println!("{}", grand_sum);
}
