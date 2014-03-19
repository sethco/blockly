module.exports = {
  app: "maze",
  levelFile: "levels",
  levelId: "2_7",
  tests: [
    {
      description: "Verify solution",
      expected: {
        result: true,
        testResult: 100
      },
      xml: '<xml><block type="controls_repeat" x="28" y="48"><title name="TIMES">4</title><statement name="DO"><block type="maze_moveForward" /></statement><next><block type="maze_turn"><title name="DIR">turnLeft</title><next><block type="controls_repeat"><title name="TIMES">5</title><statement name="DO"><block type="maze_moveForward" /></statement></block></next></block></next></block></xml>'
    }
  ]
};
