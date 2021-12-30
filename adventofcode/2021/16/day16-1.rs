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

fn parse_packet (bits: &mut BITS) -> u32{
    let version = bits.take_bit(3);
    let type_id = bits.take_bit(3);

    if type_id == 4 {
        // literal packet
        let mut value: u32 = 0;
        loop {
            let next = bits.take_bit(5);
            value = value << 4 | (next & 15);
            if next & 16 == 0 {
                break
            }
        }
        println!("literal packet parsed: ver: {}, value: {}", version, value);
        return version;
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
    let mut sum_version = version;
    println!("operator packet start: bit_pos: {}, l_type: {}, l_value: {}", init_bit_pos, length_type_id, length_value);
    loop {
        sum_version += parse_packet(bits);
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
    println!("operator packet end: bit_pos: {}, l_type: {}, l_value: {}, version: {}", init_bit_pos, length_type_id, length_value, version);
    return sum_version;
}

fn main() {
    // let filename = "test-input-6";
    let filename = "input-16";
    let input = fs::read_to_string(filename).unwrap();
    let mut bits = BITS {
        input: input.trim().chars().collect(),
        pos: 0,
        remaining: 0,
        remaining_bits: 0,
    };

    println!("sum: {}", parse_packet(&mut bits));
}
