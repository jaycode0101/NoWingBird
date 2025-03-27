Game excess:https://jaycode0101.github.io/NoWingBird/

# Galaxy Nowingbird

Galaxy Nowingbird is a browser-based game that gives a cosmic twist to classic arcade-style gameplay. Guide your futuristic bird through a dynamic, obstacle-filled galaxy while enjoying smooth physics, vibrant visuals, and responsive audio controls.

## Features

- **Cosmic Gameplay:**  
  Control your bird by clicking or pressing the Spacebar to navigate through randomly generated obstacles in a starry, animated background.
  
- **Live Adjustments:**  
  Real-time settings adjustments for game speed, gravity, pipe speed, pipe frequency, and gap size are applied immediately during gameplay.
  
- **Audio Control:**  
  Use the in-game mute button (displayed as 🔊 or 🔇) to switch the background music on or off during live gameplay.
  
- **High Score Tracking:**  
  Your best score is automatically saved and displayed, encouraging you to improve your performance.

- **Fullscreen Mode:**  
  Enjoy an immersive experience with the fullscreen toggle available on the game over screen.

## Mathematical Concepts in the Game

The game’s smooth animations and physics are driven by several mathematical principles:

- **Physics and Motion:**  
  The bird’s movement is influenced by gravity, which is applied as a constant acceleration. The bird’s velocity is updated each frame, and its position is recalculated accordingly, resulting in realistic motion.

- **Trigonometry:**  
  The rotation of the bird is calculated based on its velocity. Clamping the rotation value ensures that the bird tilts in a natural manner as it ascends or descends.

- **Geometry:**  
  Visual elements such as the bird, obstacles, stars, and planets are drawn using geometric shapes like ellipses and circles. Gradients (both linear and radial) add depth and dynamic lighting effects.

- **Randomization:**  
  Random number generation (`Math.random()`) sets initial positions, sizes, and movement parameters for stars, planets, comets, and obstacles, ensuring each playthrough is unique.

- **Animation Calculations:**  
  The use of `requestAnimationFrame` combined with periodic mathematical updates (e.g., sine functions for star twinkling) creates smooth and responsive animations.

     It's my first project so I hope you guys will be happy with my first project# NoWingBird
## Contributing

Contributions are welcome! If you have suggestions for improvements or bug fixes, please open an issue or submit a pull request. When contributing, please follow these guidelines:
- Write clear and concise commit messages.
- Ensure your code is well-commented and follows the existing style.
- Test your changes thoroughly before submitting.

Your input helps make Galaxy Nowingbird even better!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for the full license text.

## Acknowledgments

- **Inspiration:**  
  Galaxy Nowingbird is inspired by classic arcade games with a modern, cosmic twist.
- **Assets:**  
  Special thanks to the creators of the audio and visual assets that have contributed to the look and feel of this project.
