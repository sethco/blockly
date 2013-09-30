var Colours = require('./core').Colours;

//TODO: Fix hacky level-number-dependent toolbox.
var toolbox = function(page, level) {
  return turtlepage.toolbox({}, null, {
    page: page,
    level: level
  });
};

//TODO: Fix hacky level-number-dependent startBlocks.
var startBlocks = function(page, level) {
  return turtlepage.startBlocks({}, null, {
    page: page,
    level: level
  });
};

/**
 * Sets BlocklyApp constants that depend on the page and level.
 * This encapsulates many functions used for BlocklyApps.REQUIRED_BLOCKS.
 * In the future, some of these may be moved to common.js.
 */

// The internal functions are used within BlocklyApps.REQUIRED_BLOCKS.
// I've included jsdoc for some that I think would be good candidates
// for moving to common.js.

/**
 * Create the textual XML for a math_number block.
 * @param {number|string} number The numeric amount, expressed as a
 *     number or string.  Non-numeric strings may also be specified,
 *     such as '???'.
 * @return {string} The textual representation of a math_number block.
 */
var makeMathNumber = function(number) {
    return '<block type="math_number"><title name="NUM">' +
          number + '</title></block>';
};

/**
 * Generate a required blocks dictionary for a simple block that does not
 * have any parameters or values.
 * @param {string} block_type The block type.
 * @return {Object} A required blocks dictionary able to check for and
 *     generate the specified block.
 */
var simpleBlock = function(block_type) {
  return {test: function(block) {return block.type == block_type; },
          type: block_type};
};

/**
 * Generate a required blocks dictionary for a repeat loop.  This does not
 * test for the specified repeat count but includes it in the suggested block.
 * @param {number|string} count The suggested repeat count.
 * @return {Object} A required blocks dictionary able to check for and
 *     generate the specified block.
 */
var repeat = function(count) {
  // This checks for a controls_repeat block rather than looking for 'for',
  // since the latter may be generated by Turtle 2's draw_a_square.
  return {test: function(block) {return block.type == 'controls_repeat';},
          type: 'controls_repeat', titles: {'TIMES': count}};
};

/**
 * Generate a required blocks dictionary for a call to a procedure that does
 * not have a return value.
 * @param {string} name The name of the procedure being called.
 * @return {Object} A required blocks dictionary able to check for and
 *     generate the specified block.
 */
function call(name) {
  return {test: function(block) {
    return block.type == 'procedures_callnoreturn' &&
        block.getTitleValue('NAME') == name; },
          type: 'procedures_callnoreturn',
          titles: {'NAME': name}};
}

/**
 * Generate a required blocks dictionary for a call to a procedure with a
 * single argument.
 * @param {string} func_name The name of the procedure being called.
 * @return {Object} A required blocks dictionary able to check for and
 *     generate the specified block.
 */
function callWithArg(func_name, arg_name) {
  return {test: function(block) {
    return block.type == 'procedures_callnoreturn' &&
        block.getTitleValue('NAME') == func_name; },
          type: 'procedures_callnoreturn',
          extra: '<mutation name="' + func_name + '"><arg name="' + arg_name +
          '"></arg></mutation>'
         };
}

/**
 * Generate a required blocks dictionary for the definition of a procedure
 * that does not have a return value.  This does not check if any arguments
 * are defined for the procedure.
 * @param {string} name The name of the procedure being defined.
 * @return {Object} A required blocks dictionary able to check for and
 *     generate the specified block.
 */
function define(name) {
  return {test: function(block) {
    return block.type == 'procedures_defnoreturn' &&
        block.getTitleValue('NAME') == name; },
          type: 'procedures_defnoreturn',
          titles: {'NAME': name}};
}

// The remaining internal functions are specific to Turtle.

// This tests for and creates a draw_a_square block on page 2.
function drawASquare(number) {
  return {test: 'draw_a_square',
          type: 'draw_a_square',
          values: {'VALUE': makeMathNumber(number)}};
}

// This tests for and creates a draw_a_snowman block on page 2.
function drawASnowman(number) {
  return {test: 'draw_a_snowman',
          type: 'draw_a_snowman',
          values: {'VALUE': makeMathNumber(number)}};
}

// This tests for and creates the limited "move forward" block used on the
// earlier levels of the tutorial.
var MOVE_FORWARD_INLINE = {test: 'moveForward', type: 'draw_move_by_constant'};

// This tests for and creates the limited "move forward" block used on the
// earlier levels of the tutorial.
var MOVE_BACKWARD_INLINE = {test: 'moveBackward',
                            type: 'draw_move_by_constant',
                            titles: {'DIR': 'moveBackward'}};

// This tests for and creates a [right] draw_turn_by_constant_restricted block
// with the specified number of degrees as its input.  The restricted turn
// is used on the earlier levels of the tutorial.
var turnRightRestricted = function(degrees) {
  return {test: 'turnRight(' + degrees,
          type: 'draw_turn_by_constant_restricted',
          titles: {'VALUE': degrees}};
};

// This tests for and creates a [right] draw_turn block with the specified
// number of degrees as its input.  For the earliest levels, the method
// turnRightRestricted should be used instead.
var turnRight = function(degrees) {
  return {
    test: function(block) {
      return block.type == 'draw_turn' &&
          Blockly.JavaScript.valueToCode(
            block, 'VALUE', Blockly.JavaScript.ORDER_NONE) == degrees;
    },
    type: 'draw_turn',
    values: {'VALUE': makeMathNumber(degrees)}};
};

// This tests for and creates a left draw_turn block with the specified
// number of degrees as its input.  This method is not appropriate for the
// earliest levels of the tutorial, which do not provide draw_turn.
var turnLeft = function(degrees) {
  return {test: function(block) {
    return block.type == 'draw_turn' &&
        block.getTitleValue('DIR') == 'turnLeft'; },
          type: 'draw_turn',
          titles: {'DIR': 'turnLeft'},
          values: {'VALUE': makeMathNumber(degrees)}};
};

// This tests for any draw_move block and, if not present, creates
// one with the specified distance.
var move = function(distance) {
  return {test: function(block) {return block.type == 'draw_move'; },
          type: 'draw_move',
          values: {'VALUE': makeMathNumber(distance)}};
};

// This tests for and creates a "set colour" block with a colour picker
// as its input.
var SET_COLOUR_PICKER = {test: 'penColour(\'#',
  type: 'draw_colour',
  values: {'COLOUR': '<block type="colour_picker"></block>'}};

// This tests for and creates a "set colour" block with a random colour
// generator as its input.
var SET_COLOUR_RANDOM = {test: 'penColour(colour_random',
  type: 'draw_colour',
  values: {'COLOUR': '<block type="colour_random"></block>'}};

/**
 * Creates a required block specification for defining a function with an
 * argument.  Unlike the other functions to create required blocks, this
 * is defined outside of Turtle.setBlocklyAppConstants because it is accessed
 * when checking for a procedure on levels 8-9 of Turtle 3.
 * @param {string} func_name The name of the function.
 * @param {string} arg_name The name of the single argument.
 * @return A required block specification that tests for a call of the
 *     specified function with the specified argument name.  If not present,
 *     this contains the information to create such a block for display.
 * @private
 */
exports.defineWithArg_ = function(func_name, arg_name) {
  return {
    test: function(block) {
      return block.type == 'procedures_defnoreturn' &&
          block.getTitleValue('NAME') == func_name &&
          block.arguments_ && block.arguments_.length &&
          block.arguments_[0] == arg_name;
    },
    type: 'procedures_defnoreturn',
    titles: {'NAME': func_name},
    extra: '<mutation><arg name="' + arg_name + '"></arg>'
  };
};

/**
 * Information about level-specific requirements.
 */
var LEVELS = {
  // Level 1: El.
  '1_1': {
    ideal: 3,
    toolbox: toolbox(1, 1),
    startBlocks: startBlocks(1, 1),
    requiredBlocks: [[MOVE_FORWARD_INLINE], [turnRightRestricted(90)]],
    freePlay: false
  },
  // Level 2: Square (without repeat).
  '1_2': {
    ideal: 7,
    toolbox: toolbox(1, 2),
    startBlocks: startBlocks(1, 2),
    requiredBlocks: [
      [MOVE_FORWARD_INLINE],
      [turnRightRestricted(90)],
      [SET_COLOUR_PICKER]
    ],
    requiredColours: 4,
    freePlay: false
  },
  // Level 3: Square (with repeat).
  '1_3': {
    ideal: 3,
    toolbox: toolbox(1, 3),
    startBlocks: startBlocks(1, 3),
    requiredBlocks: [
      [MOVE_FORWARD_INLINE],
      [turnRightRestricted(90)],
      [repeat(4)]
    ],
    freePlay: false
  },
  // Level 4: Triangle.
  '1_4': {
    ideal: 3,
    toolbox: toolbox(1, 4),
    startBlocks: startBlocks(1, 4),
    requiredBlocks: [
      [MOVE_FORWARD_INLINE],
      [repeat(3)],
      [{
        test: 'turnRight',
        type: 'draw_turn_by_constant',
        titles: {VALUE: '???'}
      }],
      [SET_COLOUR_RANDOM]
    ],
    requiredColors: 3,
    freePlay: false
  },
  // Level 5: Envelope.
  '1_5': {
    ideal: 6,
    toolbox: toolbox(1, 5),
    startBlocks: startBlocks(1, 5),
    requiredBlocks: [
      [repeat(3)],
      [turnRightRestricted(120)],
      [MOVE_FORWARD_INLINE]
    ],
    freePlay: false
  },
  // Level 6: triangle and square.
  '1_6': {
    ideal: 7,
    toolbox: toolbox(1, 6),
    startBlocks: startBlocks(1, 6),
    requiredBlocks: [
      [repeat(3)],
      [turnRightRestricted(120)],
      [MOVE_FORWARD_INLINE],
      [MOVE_BACKWARD_INLINE, MOVE_FORWARD_INLINE]
    ],
    freePlay: false
  },
  // Level 7: glasses.
  '1_7': {
    ideal: 8,
    toolbox: toolbox(1, 7),
    startBlocks: startBlocks(1, 7),
    requiredBlocks: [
      [turnRightRestricted(90)],
      [MOVE_FORWARD_INLINE],
      [SET_COLOUR_PICKER],
      [repeat(4)],
      [MOVE_BACKWARD_INLINE, MOVE_FORWARD_INLINE]
    ],
    requiredColors: Colours.GREEN,
    freePlay: false
  },
  // Level 8: spikes.
  '1_8': {
    ideal: 4,
    toolbox: toolbox(1, 8),
    startBlocks: startBlocks(1, 8),
    requiredBlocks: [[repeat(8)]],
    requiredColors: 8,
    freePlay: false
  },
  // Level 9: circle.
  '1_9': {
    ideal: 3,
    toolbox: toolbox(1, 9),
    startBlocks: startBlocks(1, 9),
    freePlay: false,
    sliderSpeed: 0.9
  },
  // Level 10: playground.
  '1_10': {
    toolbox: toolbox(1, 10),
    startBlocks: startBlocks(1, 10),
    freePlay: true
  },
  // Formerly Page 2.
  // Level 1: Square.
  '2_1': {
    ideal: 5,
    toolbox: toolbox(2, 1),
    startBlocks: startBlocks(2, 1),
    requiredBlocks: [
      [repeat(4)],
      [turnRight(90)],
      [move(100)],
      [SET_COLOUR_PICKER]
    ],
    requiredColors: 1,
    freePlay: false
  },
  // Level 2: Small green square.
  '2_2': {
    ideal: 2,
    toolbox: toolbox(2, 2),
    startBlocks: startBlocks(2, 2),
    requiredBlocks: [
      [drawASquare('??')],
      [SET_COLOUR_PICKER]
    ],
    requiredColors: Colours.GREEN,
    freePlay: false
  },
  // Level 3: Three squares.
  '2_3': {
    ideal: 5,
    toolbox: toolbox(2, 3),
    startBlocks: startBlocks(2, 3),
    requiredBlocks: [
      [repeat(3)],
      [drawASquare(100)],
      [turnRight(120)],
      [SET_COLOUR_RANDOM]
    ],
    freePlay: false
  },
  // Level 4: 36 squares.
  '2_4': {
    ideal: 5,
    toolbox: toolbox(2, 4),
    startBlocks: startBlocks(2, 4),
    freePlay: false
  },
  // Level 5: Different size squares.
  '2_5': {
    ideal: 10,
    toolbox: toolbox(2, 5),
    startBlocks: startBlocks(2, 5),
    requiredBlocks: [
      [drawASquare('??')]
    ],
    freePlay: false
  },
  // Level 6: For-loop squares.
  '2_6': {
    ideal: 6,
    toolbox: toolbox(2, 6),
    startBlocks: startBlocks(2, 6),
    // This is not displayed properly.
    requiredBlocks: [[simpleBlock('variables_get_counter')]],
    freePlay: false
  },
  // Level 7: Boxy spiral.
  '2_7': {
    ideal: 8,
    toolbox: toolbox(2, 7),
    startBlocks: startBlocks(2, 7),
    requiredBlocks: [
      [simpleBlock('controls_for_counter')],
      [move('??')],
      [simpleBlock('variables_get_counter')],
      [turnRight(90)]
    ],
    freePlay: false
  },
  // Level 8: Three snowmen.
  '2_8': {
    ideal: 9,
    toolbox: toolbox(2, 8),
    startBlocks: startBlocks(2, 8),
    requiredBlocks: [
      [drawASnowman(150)],
      [turnRight(90)],
      [turnLeft(90)],
      [{
        test: 'jump',
        type: 'jump',
        values: {'VALUE': makeMathNumber(100)}
      }],
      [simpleBlock('jump')],
      [repeat(3)],
      [simpleBlock('draw_colour')]
    ],
    requiredColors: 3,
    freePlay: false,
    sliderSpeed: 0.9
  },
  // Level 9: Snowman family.
  '2_9': {
    ideal: 12,
    toolbox: toolbox(2, 9),
    startBlocks: startBlocks(2, 9),
    requiredBlocks: [
      [drawASnowman('??')],
      [simpleBlock('controls_for_counter')],
      [simpleBlock('variables_get_counter')],
      [turnRight(90)],
      [turnLeft(90)],
      [{
        test: 'jump',
        type: 'jump',
        values: {'VALUE': makeMathNumber(60)}
      }]
    ],
    freePlay: false,
    sliderSpeed: 0.9
  },
  // Level 10: playground.
  '2_10': {
    freePlay: true,
    toolbox: toolbox(2, 10),
    startBlocks: startBlocks(2, 10)
  },
  // Formerly Page 3.
  // Level 1: Call 'draw a square'.
  '3_1': {
    ideal: 1,
    toolbox: toolbox(3, 1),
    startBlocks: startBlocks(3, 1),
    requiredBlocks: [
      [call('draw a square')]
    ],
    freePlay: false
  },
  // Level 2: Create "draw a triangle".
  '3_2': {
    ideal: 7,
    toolbox: toolbox(3, 2),
    startBlocks: startBlocks(3, 2),
    requiredBlocks: [
      [repeat(3)],
      [move(100)],
      [turnRight(120)],
      [call('draw a triangle')]
    ],
    freePlay: false
  },
  // Level 3: Fence the animals.
  '3_3': {
    ideal: 7,
    toolbox: toolbox(3, 3),
    startBlocks: startBlocks(3, 3),
    requiredBlocks: [
      [call('draw a triangle')],
      [move(100)],
      [call('draw a square')]
    ],
    freePlay: false
  },
  // Level 4: House the lion.
  '3_4': {
    ideal: 6,
    toolbox: toolbox(3, 4),
    startBlocks: startBlocks(3, 4),
    requiredBlocks: [
      [call('draw a square')],
      [move(100)],
      [turnRight(30)],
      [call('draw a triangle')]
    ],
    freePlay: false
  },
  // Level 5: Create "draw a house".
  '3_5': {
    ideal: 8,
    toolbox: toolbox(3, 5),
    startBlocks: startBlocks(3, 5),
    requiredBlocks: [
      [define('draw a house')],
      [call('draw a square')],
      [move(100)],
      [turnRight(30)],
      [call('draw a triangle')],
      [call('draw a house')]
    ],
    freePlay: false
  },
  // Level 6: Add parameter to "draw a triangle".
  '3_6': {
    ideal: 13,
    toolbox: toolbox(3, 6),
    startBlocks: startBlocks(3, 6),
    requiredBlocks: [
      [exports.defineWithArg_('draw a triangle', 'length')],
      [simpleBlock('variables_get_length')],
      [callWithArg('draw a triangle', 'length')]
    ],
    requiredColors: 2,
    freePlay: false
  },
  // Level 7: Add parameter to "draw a house".
  '3_7': {
    ideal: 13,
    toolbox: toolbox(3, 7),
    startBlocks: startBlocks(3, 7),
    requiredBlocks: [
      [exports.defineWithArg_('draw a house', 'height')],
      [callWithArg('draw a square', 'length')],
      [callWithArg('draw a triangle', 'length')],
      [simpleBlock('variables_get_height')],
      [callWithArg('draw a house', 'height')]
    ],
    freePlay: false
  },
  // Level 8: Draw houses.
  '3_8': {
    ideal: 27,
    toolbox: toolbox(3, 8),
    startBlocks: startBlocks(3, 8),
    freePlay: false
  },
  // Level 9: Draw houses with for loop.
  '3_9': {
    ideal: 27,
    toolbox: toolbox(3, 9),
    startBlocks: startBlocks(3, 9),
    requiredBlocks: [
      [simpleBlock('controls_for_counter')],
      [simpleBlock('variables_get_counter')],
      [SET_COLOUR_RANDOM]
    ],
    requiredColors: 3,
    freePlay: false
  },
  // Level 10: playground.
  '3_10': {
    freePlay: true,
    toolbox: toolbox(3, 10),
    startBlocks: startBlocks(3, 10)
  },
  // Formerly Page 4.
  // Level 1: playground.
  '4_1': {
    freePlay: true,
    toolbox: toolbox(4, 1),
    startBlocks: startBlocks(4, 1)
  },
  // Level 2: playground.
  '4_2': {
    freePlay: true,
    toolbox: toolbox(4, 2),
    startBlocks: startBlocks(4, 2)
  },
  // Level 3: playground.
  '4_3': {
    freePlay: true,
    toolbox: toolbox(4, 3),
    startBlocks: startBlocks(4, 3)
  },
  // Level 4: playground.
  '4_4': {
    freePlay: true,
    toolbox: toolbox(4, 4),
    startBlocks: startBlocks(4, 4)
  }
};

exports.install = function(BlocklyApps, Turtle) {
  var levelId = BlocklyApps.getStringParamFromUrl('level', '1_1');

  //TODO: Remove PAGE and LEVEL variables
  var split = levelId.split('_');
  Turtle.PAGE = Number(split[0]);
  Turtle.LEVEL = Number(split[1]);

  // Set constants with information extracted from the URL.
  var level = LEVELS[levelId];
  BlocklyApps.IDEAL_BLOCK_NUM = level.ideal || Infinity;
  BlocklyApps.REQUIRED_BLOCKS = level.requiredBlocks || [];
  return level;
};
