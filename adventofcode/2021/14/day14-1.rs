use std::fs;
use std::collections::HashMap;

fn main() {
    // let filename = "test-input";
    let filename = "input-14";
    let input = fs::read_to_string(filename).unwrap();

    let (template, pairs) = input.split_once("\n\n").unwrap();
    let mut current_pairs: HashMap<(char, char), i32> = HashMap::new();

    let template_chars: Vec<char> = template.chars().collect();

    for win in template_chars.windows(2) {
        let entry = current_pairs.entry((win[0], win[1])).or_insert(0);
        *entry += 1;
    }

    let mut insert_map: HashMap<(char, char), char> = HashMap::new();
    for pair in pairs.lines() {
        if pair.len() != 7 {
            continue;
        }
        let pair: Vec<char> = pair.chars().collect();
        insert_map.insert((pair[0], pair[1]), pair[6]);
    }

    for _step in 0..10 {
        let mut next_pairs: HashMap<(char, char), i32> = HashMap::new();
        for ((c1, c2), count) in current_pairs {
            let insert = insert_map.get(&(c1, c2)).unwrap();
            let entry = next_pairs.entry((c1, *insert)).or_insert(0);
            *entry += count;
            let entry = next_pairs.entry((*insert, c2)).or_insert(0);
            *entry += count;
        }
        current_pairs = next_pairs;
    }
    let mut char_count: HashMap<char, i32> = HashMap::new();
    for ((c1, _c2), count) in current_pairs {
        let entry = char_count.entry(c1).or_insert(0);
        *entry += count;
    }
    let tail_char = template.chars().last().unwrap();
    let entry = char_count.entry(tail_char).or_insert(0);
    *entry += 1;
    println!("{:?}", char_count);
    let mut max_count = i32::MIN;
    let mut min_count = i32::MAX;
    for count in char_count.into_values() {
        max_count = max_count.max(count);
        min_count = min_count.min(count);
    }
    println!("max: {}, min: {}, max - min: {}", max_count, min_count, max_count - min_count);

}
