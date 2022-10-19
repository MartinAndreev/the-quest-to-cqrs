import * as Phaser from 'phaser';

export const flashElement = (
  scene: Phaser.Scene,
  element: Phaser.GameObjects.GameObject,
  repeat = true,
  easing = 'Linear',
  overallDuration = 1500,
  visiblePauseDuration = 500,
) => {
  let flashDuration = overallDuration - visiblePauseDuration / 2;
  scene.tweens.timeline({
    tweens: [
      {
        targets: element,
        duration: 0,
        alpha: 0,
        ease: easing,
      },
      {
        targets: element,
        duration: flashDuration,
        alpha: 1,
        ease: easing,
      },
      {
        targets: element,
        duration: visiblePauseDuration,
        alpha: 1,
        ease: easing,
      },
      {
        targets: element,
        duration: flashDuration,
        alpha: 0,
        ease: easing,
        onComplete: () => {
          if (repeat) {
            flashElement(scene, element);
          }
        },
      },
    ],
  });
};
