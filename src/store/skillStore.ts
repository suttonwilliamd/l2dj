import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Skill, SKILLS } from '../data/skills';

interface SkillState {
  unlockedSkills: Set<string>;
  availableSkills: Skill[];
  unlockedVocabulary: Set<string>;
  unlockedControls: Set<string>;
  
  // Actions
  unlockSkill: (skillId: string) => void;
  isSkillUnlocked: (skillId: string) => boolean;
  isSkillAvailable: (skillId: string) => boolean;
  isControlUnlocked: (controlId: string) => boolean;
  isVocabularyUnlocked: (word: string) => boolean;
  getAvailableSkills: () => Skill[];
}

export const useSkillStore = create<SkillState>()(
  persist(
    (set, get) => ({
      unlockedSkills: new Set(),
      availableSkills: [],
      unlockedVocabulary: new Set(),
      unlockedControls: new Set(),

      unlockSkill: (skillId: string) => {
        const { unlockedSkills, unlockedVocabulary, unlockedControls } = get();
        
        if (unlockedSkills.has(skillId)) return;

        const skill = SKILLS.find(s => s.id === skillId);
        if (!skill) return;

        const newUnlockedSkills = new Set(unlockedSkills).add(skillId);
        const newUnlockedVocabulary = new Set(unlockedVocabulary);
        const newUnlockedControls = new Set(unlockedControls);

        skill.unlocks.vocabulary.forEach(word => newUnlockedVocabulary.add(word));
        skill.unlocks.controls.forEach(control => newUnlockedControls.add(control));

        set({
          unlockedSkills: newUnlockedSkills,
          unlockedVocabulary: newUnlockedVocabulary,
          unlockedControls: newUnlockedControls,
        });
      },

      isSkillUnlocked: (skillId: string) => {
        return get().unlockedSkills.has(skillId);
      },

      isSkillAvailable: (skillId: string) => {
        const skill = SKILLS.find(s => s.id === skillId);
        if (!skill) return false;

        const { unlockedSkills } = get();
        return skill.prerequisites.every(prereq => unlockedSkills.has(prereq));
      },

      isControlUnlocked: (controlId: string) => {
        return get().unlockedControls.has(controlId);
      },

      isVocabularyUnlocked: (word: string) => {
        return get().unlockedVocabulary.has(word);
      },

      getAvailableSkills: () => {
        const { unlockedSkills } = get();
        return SKILLS.filter(skill => 
          !unlockedSkills.has(skill.id) && 
          skill.prerequisites.every(prereq => unlockedSkills.has(prereq))
        );
      },
    }),
    {
      name: 'skill-storage',
      partialize: (state) => ({
        unlockedSkills: Array.from(state.unlockedSkills),
        unlockedVocabulary: Array.from(state.unlockedVocabulary),
        unlockedControls: Array.from(state.unlockedControls),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.unlockedSkills = new Set(state.unlockedSkills);
          state.unlockedVocabulary = new Set(state.unlockedVocabulary);
          state.unlockedControls = new Set(state.unlockedControls);
        }
      },
    }
  )
);