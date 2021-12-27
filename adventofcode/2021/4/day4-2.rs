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
    let filename = "./test_input";
    // let filename = "./input-4";
    let content = fs::read_to_string(filename).unwrap();
    let sections: Vec<&str> = content.split_terminator("\n\n").collect();

    let boards: Vec<Vec<&str>> = sections[1..]
        .iter()
        .map(|s| s.split_whitespace().collect())
        .collect();

    let seq: Vec<&str> = sections[0].split(',').collect();
    let mut nums = HashSet::new();
    let mut board_idx: Vec<usize> = (0..boards.len()).collect();
    let mut result = None;
    for n in seq {
        nums.insert(n.to_string());
        let (won, yet): (Vec<usize>, Vec<usize>) = board_idx
                         .into_iter()
                         .partition(|&idx| check_win(&boards[idx], &nums));
        if yet.len() == 0 {
            result = Some((won[0], n));
            break
        }
        board_idx = yet;
    }
    let (idx, last_n) = result.unwrap();
    let last_n: i32 = last_n.parse().unwrap();
    let sum: i32 = boards[idx]
        .iter()
        .filter(|&&n| !nums.contains(n))
        .filter_map(|&n| n.parse::<i32>().ok())
        .sum();
    println!("sum: {}, last_n: {}, result: {}", sum, last_n, sum * last_n)
}
