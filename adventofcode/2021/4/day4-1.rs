use std::fs;
use std::collections::HashSet;

fn check_win(board: &Vec<&str>, nums: &HashSet<String>) -> bool {
    for i in 0..5 {
        let mut horizontal_win = true;
        let mut vertical_win = true;
        for j in 0..5 {
            vertical_win = vertical_win && nums.contains(board[i + j * 5]);
            horizontal_win = horizontal_win && nums.contains(board[i * 5 + j]);
        }
        if horizontal_win || vertical_win {
            return true
        }
    }
    false
}

fn main() {
    // let filename = "./test_input";
    let filename = "./input-4";
    let content = fs::read_to_string(filename).unwrap();
    let sections: Vec<&str> = content.split_terminator("\n\n").collect();

    let mut boards: Vec<Vec<&str>> = vec![];
    for i in 1..sections.len() {
        boards.push(sections[i].split_whitespace().collect());
    }

    let seq: Vec<&str> = sections[0].split(',').collect();
    let mut nums = HashSet::new();
    let mut result = None;
    for i in 0..seq.len() {
        let n = seq[i];
        nums.insert(n.to_string());
        if let Some(board) = boards.iter().find(|board| check_win(&board, &nums)) {
            result = Some((board, n));
            break;
        }
    }
    let (board, last_n) = result.unwrap();
    let last_n: i32 = last_n.parse().unwrap();
    let mut sum: i32 = 0;
    for n in board {
        if !nums.contains(&n.to_string()) {
            sum += n.parse::<i32>().unwrap();
        }
    }
    println!("sum: {}, last_n: {}, result: {}", sum, last_n, sum * last_n)

}
