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
    // for d in 1..80 { // part 1
    for d in 1..256 { // part 2
        // treat count as a circular buffer
        count[(d + 7) % 9] += count[d % 9]
    }
    println!("{:?}", count);
    println!("{:?}", count.iter().sum::<i64>());
}
