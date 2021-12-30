use std::fs;
use std::convert::TryInto;

#[derive(Debug)]
struct BITS {
    input: Vec<char>,
    pos: usize,
    remaining: u32,
    remaining_bits: usize,
}

fn convert_hex (c: char) -> u32 {
    match c {
        '0' => 0,
        '1' => 1,
        '2' => 2,
        '3' => 3,
        '4' => 4,
        '5' => 5,
        '6' => 6,
        '7' => 7,
        '8' => 8,
        '9' => 9,
        'A' => 10,
        'B' => 11,
        'C' => 12,
        'D' => 13,
        'E' => 14,
        'F' => 15,
        _ => panic!("not hex!"),
    }
}

impl BITS {
    fn take_bit (&mut self, count: usize) -> u32 {
        if count > 32 {
            panic!("surprise!");
        }
        while self.remaining_bits < count {
            if self.pos >= self.input.len() {
                panic!("not enough chars!");
            }
            let next = convert_hex(self.input[self.pos]);
            self.pos += 1;
            self.remaining_bits += 4;
            self.remaining = self.remaining << 4 | next;
        }
        if self.remaining_bits > 32 {
            panic!("remaining_bits too many!");
        }
        self.remaining_bits -= count;
        let res = self.remaining >> self.remaining_bits;
        self.remaining = if self.remaining_bits == 0 {
            0
        } else {
            self.remaining & ((1 << self.remaining_bits) - 1)
        };
        return res;
    }
    fn bit_pos(&self) -> usize {
        self.pos * 4 - self.remaining_bits
    }
}

fn parse_packet (bits: &mut BITS) -> u64 {
    let version = bits.take_bit(3);
    let type_id = bits.take_bit(3);

    if type_id == 4 {
        // literal packet
        let mut value: u64 = 0;
        let mut total_taken_bits: usize = 0;
        loop {
            let next = bits.take_bit(5);
            total_taken_bits += 4;
            assert!(total_taken_bits < 64);
            value = (value << 4) | u64::from(next & 15);
            if next & 16 == 0 {
                break
            }
        }
        // println!("literal packet parsed: ver: {}, value: {}", version, value);
        return value;
    }
    // operator packet
    let length_type_id = bits.take_bit(1);
    let length_value = if length_type_id == 0 {
        bits.take_bit(15)
    } else {
        bits.take_bit(11)
    };
    let length_value: usize= length_value.try_into().unwrap();
    let init_bit_pos = bits.bit_pos();
    let mut subpacket_count: usize = 0;
    let mut subs: Vec<u64> = Vec::new();
    // println!("operator packet start: bit_pos: {}, l_type: {}, l_value: {}", init_bit_pos, length_type_id, length_value);
    loop {
        subs.push(parse_packet(bits));
        subpacket_count += 1;
        if length_type_id == 0 {
            let bits_taken = bits.bit_pos() - init_bit_pos;
            if bits_taken == length_value {
                break;
            }
            if bits_taken > length_value {
                panic!("bits_taken > length_value");
            }
        } else {
            if subpacket_count == length_value {
                break;
            }
        }
    }
    let ret = match type_id {
        0 => subs.iter().copied().sum(),
        1 => subs.iter().copied().product(),
        2 => subs.iter().copied().min().unwrap(),
        3 => subs.iter().copied().max().unwrap(),
        5 => {
            assert!(subs.len() == 2);
            if subs[0] > subs[1] {
                1
            } else {
                0
            }
        }
        6 => {
            assert!(subs.len() == 2);
            if subs[0] < subs[1] {
                1
            } else {
                0
            }
        }
        7 => {
            assert!(subs.len() == 2);
            if subs[0] == subs[1] {
                1
            } else {
                0
            }
        }
        _ => panic!("unknown operator"),
    };
    println!("operator packet end: bit_pos: {}, type_id: {}, subs: {:?} -> {}", init_bit_pos, type_id, subs, ret);
    return ret;
}

fn main() {
    // let filename = "test-input-multi";
    let filename = "input-16";
    let input = fs::read_to_string(filename).unwrap();

    for line in input.lines() {
        let mut bits = BITS {
            input: line.trim().chars().collect(),
            pos: 0,
            remaining: 0,
            remaining_bits: 0,
        };

        println!("value: {}", parse_packet(&mut bits));
    }
}
