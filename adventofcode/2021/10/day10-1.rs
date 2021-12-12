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

    let mut score_sum: i32 = 0;
    for l in input.lines() {
        let mut stack: Vec<char> = Vec::new();
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
                score_sum += match c {
                  ')' => 3,
                  ']' => 57,
                  '}' => 1197,
                  '>' => 25137,
                  _ => panic!("!?"),
                };
                break;
            }
        }
    }
    println!("{}", score_sum);
}
