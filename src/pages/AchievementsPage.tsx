import { motion } from 'framer-motion';
import { Trophy, Star, Target, Clock } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useProgress } from '../context/AppStateHooks';

const AchievementsPage = () => {
  const { t } = useTranslation();
  const { progress } = useProgress();

  const achievements = [
    {
      id: 'first-lesson',
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: Star,
      unlocked: progress.completedLessons.size > 0,
      progress: Math.min(progress.completedLessons.size, 1),
      maxProgress: 1,
    },
    {
      id: 'streak-7',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: Clock,
      unlocked: progress.currentStreak >= 7,
      progress: Math.min(progress.currentStreak, 7),
      maxProgress: 7,
    },
    {
      id: 'score-1000',
      title: 'Point Master',
      description: 'Earn 1000 points',
      icon: Target,
      unlocked: progress.totalScore >= 1000,
      progress: Math.min(progress.totalScore, 1000),
      maxProgress: 1000,
    },
    {
      id: 'all-lessons',
      title: 'Math Master',
      description: 'Complete all lessons',
      icon: Trophy,
      unlocked: false,
      progress: progress.completedLessons.size,
      maxProgress: 20,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🏆 {t('navigation.achievements')}
            </h1>
            <p className="text-lg text-gray-600">
              Your learning milestones and accomplishments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                className={`bg-white rounded-xl shadow-lg p-6 ${
                  achievement.unlocked ? 'ring-2 ring-yellow-400' : ''
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <achievement.icon
                    className={`w-8 h-8 ${
                      achievement.unlocked ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                  />
                  {achievement.unlocked && (
                    <span className="text-yellow-500 text-2xl">✨</span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {achievement.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {achievement.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Progress</span>
                    <span>
                      {achievement.progress} / {achievement.maxProgress}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${
                        achievement.unlocked ? 'bg-yellow-500' : 'bg-primary-600'
                      }`}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                      }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AchievementsPage;