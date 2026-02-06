import React from 'react';
import { useSkillStore } from '../../store/skillStore';
import { SKILLS } from '../../data/skills';

export const SkillTree: React.FC = () => {
  const { 
    unlockedSkills, 
    unlockSkill, 
    isSkillUnlocked, 
    isSkillAvailable
  } = useSkillStore();

  const handleUnlockSkill = (skillId: string) => {
    unlockSkill(skillId);
  };

  const renderSkillNode = (skill: typeof SKILLS[0]) => {
    const isUnlocked = isSkillUnlocked(skill.id);
    const isAvailable = isSkillAvailable(skill.id);

    return (
      <div
        key={skill.id}
        className={`skill-node p-4 rounded-lg border-2 transition-all ${
          isUnlocked 
            ? 'bg-green-900 border-green-600' 
            : isAvailable 
              ? 'bg-blue-900 border-blue-600 hover:bg-blue-800 cursor-pointer' 
              : 'bg-gray-800 border-gray-600 opacity-50 cursor-not-allowed'
        }`}
        onClick={() => isAvailable && !isUnlocked && handleUnlockSkill(skill.id)}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-white">{skill.name}</h3>
          <div className="flex items-center space-x-2">
            {isUnlocked && (
              <span className="text-green-400 text-sm">✓ Unlocked</span>
            )}
            {!isUnlocked && isAvailable && (
              <span className="text-blue-400 text-sm">Click to unlock</span>
            )}
            {!isAvailable && (
              <span className="text-gray-400 text-sm">Locked</span>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-300 mb-3">{skill.description}</p>
        
        {/* Prerequisites */}
        {skill.prerequisites.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-1">Prerequisites:</p>
            <div className="flex flex-wrap gap-1">
              {skill.prerequisites.map(prereq => {
                const prereqSkill = SKILLS.find(s => s.id === prereq);
                const isPrereqUnlocked = prereqSkill ? isSkillUnlocked(prereqSkill.id) : false;
                return (
                  <span
                    key={prereq}
                    className={`text-xs px-2 py-1 rounded ${
                      isPrereqUnlocked ? 'bg-green-800 text-green-300' : 'bg-red-800 text-red-300'
                    }`}
                  >
                    {prereqSkill?.name || prereq}
                  </span>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Unlocks */}
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-1">Unlocks:</p>
          <div className="space-y-1">
            {skill.unlocks.vocabulary.length > 0 && (
              <div>
                <span className="text-xs text-blue-300">Vocabulary: </span>
                <span className="text-xs text-gray-300">
                  {skill.unlocks.vocabulary.join(', ')}
                </span>
              </div>
            )}
            {skill.unlocks.controls.length > 0 && (
              <div>
                <span className="text-xs text-purple-300">Controls: </span>
                <span className="text-xs text-gray-300">
                  {skill.unlocks.controls.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Lesson - only show if unlocked */}
        {isUnlocked && (
          <div className="mt-3 p-3 bg-gray-800 rounded border border-gray-600">
            <p className="text-xs text-gray-300 italic">{skill.lesson}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="skill-tree bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 w-96 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center">
        <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
        Learning Path
      </h2>
      
      <div className="space-y-4">
        {SKILLS.map(skill => renderSkillNode(skill))}
      </div>

      {/* Progress Summary */}
      <div className="mt-6 pt-6 border-t border-gray-600">
        <div className="flex justify-between text-sm text-gray-300">
          <span>Progress: {unlockedSkills.size} / {SKILLS.length}</span>
          <span>{Math.round((unlockedSkills.size / SKILLS.length) * 100)}%</span>
        </div>
        <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${(unlockedSkills.size / SKILLS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};