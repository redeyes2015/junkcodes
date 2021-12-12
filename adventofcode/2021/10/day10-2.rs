use std::fs;

fn main() {
    // let filename = "test_input";
    let filename = "input-10";
    let input = fs::read_to_string(filename).unwrap();
    let pairs = [
      ('(', ')'),
      ('[', ']'),
      ('{', '}'),
      ('<', '>'),
    ];

    let mut scores: Vec<i64> = Vec::new();
    for l in input.lines() {
        let mut stack: Vec<char> = Vec::new();
        let mut corrupted = false;
        for c in l.chars() {
            if "{[(<".contains(c) {
                stack.push(c);
                continue;
            }
            let tail: char = if stack.len() == 0 {
                ' '
            } else {
                stack[stack.len() - 1]
            };
            if pairs.iter().any(
              |(open, close)| tail == *open && c == *close
            ) {
              stack.pop();
            } else {
                corrupted = true;
                break;
            }
        }
        if stack.len() == 0 || corrupted {
            continue;
        }
        let mut score: i64 = 0;
        for c in stack.iter().rev() {
            score = score * 5 + match c {
                '(' => 1,
                '[' => 2,
                '{' => 3,
                '<' => 4,
                _ => panic!("!?"),
            };
        }
        scores.push(score);
    }
    scores.sort();
    println!("{}", scores[scores.len() / 2]);
}
