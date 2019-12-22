//const canvas
const WIDTH = 1200;
const HEIGHT = 550;

//const skateborad
const SKATE_COLOR = 'orange';
const SKATE_WIDTH = WIDTH / 7;
const SKATE_HEIGHT = 15;
const START_POS_SKATE_X = (WIDTH - SKATE_WIDTH) / 2;
const SKATE_Y = HEIGHT - SKATE_HEIGHT - 50;

//const ball
const BALL_RADIUS = SKATE_WIDTH / 10;
const BALL_COLOR = 'red';
const START_POS_BALL_X = START_POS_SKATE_X + SKATE_WIDTH / 2 + 5;
const START_POS_BALL_Y = SKATE_Y - SKATE_HEIGHT + SKATE_HEIGHT / 4 - 5;
const DEFAULT_SPEEP_X = 4;
const DEFAULT_SPEEP_Y = -5;

//const bricks
const BRICKS_COLOR = 'green';
const BRICKS_MARGIN = 25;
const OFFSET_X = 25;
const OFFSET_Y = 50;
const N_COLUMN = 10;
const MAX_LEVEL = 10;
/*
 2*offset + n*bricks-width + (n-1)*margin = WIDTH_CANVAS
=> bricks-width = ( WIDTH - 2*offset - (n-1)*margin ) / n
*/
const BRICKS_WIDTH = (WIDTH - 2 * OFFSET_X - (N_COLUMN - 1) * BRICKS_MARGIN) / N_COLUMN;
const BRICKS_HEIGHT = 15;