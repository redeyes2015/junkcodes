use std::fs;

fn main() {
    // let filename = "test_input";
    let filename = "input-6";
    let content = fs::read_to_string(filename).unwrap();

    let mut count = [0 as i64; 9];
    for d in content.trim().split(',') {
        let d: usize = d.parse().unwrap();
        if d > 9 {
            continue;
        }
        count[d] += 1;
    }
    // for _d in 0..80 { // part 1
    for _d in 0..256 { // part 2
        let reached = count[0];
        for i in 0..8 {
            count[i] = count[i + 1];
        }
        count[6] += reached;
        count[8] = reached;
    }
    println!("{:?}", count);
    println!("{:?}", count.iter().sum::<i64>());
}
