struct Square {
    top: i32,
    bottom: i32,
    right: i32,
    left: i32,
}
enum RoundResult {
    Hit,
    Miss,
    BreakY,
}
fn round(init_x: i32, init_y: i32, square: &Square) -> RoundResult {
    let mut x: i32 = 0;
    let mut y: i32 = 0;
    let mut vx: i32 = init_x;
    let mut vy: i32 = init_y;
    let Square {
        right,
        left,
        bottom,
        top
    } = *square;

    loop {
        x += vx;
        y += vy;
        // println!("{}, {}", x, y);
        if vx > 0 {
            vx -= 1;
        }
        vy -= 1;
        if x <= right && x >= left && y >= bottom && y <= top {
            println!("hit: {}, {}", init_x, init_y);
            return RoundResult::Hit;
        }
        if y == 0 && vy < bottom {
            println!("break_y 1: {}, {}", init_x, init_y);
            return RoundResult::BreakY;
        }
        if y < bottom {
            return RoundResult::Miss;
        }
    }
}

fn main() {
    // target area: x=20..30, y=-10..-5
    // let top: i32 = -5;
    // let bottom: i32 = -10;
    // let right: i32 = 30;
    // let left: i32 = 20;

    // target area: x=85..145, y=-163..-108
    let top: i32 = -108;
    let bottom: i32 = -163;
    let right: i32 = 145;
    let left: i32 = 85;

    let square = Square {
        top,
        bottom,
        left,
        right,
    };

    let mut max_init_y: i32 = 0;
    for init_x in 1..=right {
        if (init_x * (init_x + 1) / 2) < left {
            continue;
        }
        for init_y in 0..-bottom {
            match round(init_x, init_y, &square) {
                RoundResult::BreakY => {
                    break;
                },
                RoundResult::Hit => {
                    max_init_y = max_init_y.max(init_y);
                },
                _ => {},
            }
        }
    }
    let y = max_init_y;
    println!("{}, {}", y, y * (y + 1) / 2);
}
