// Progress tracking hooks for quiz times and learned countries

const STORAGE_KEYS = {
  QUIZ_TIMES: 'geo-explorer-quiz-times',
  LEARNED: 'geo-explorer-learned',
};

// Quiz best times
export function getQuizBestTime(regionId, difficulty) {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_TIMES) || '{}');
    return data[`${regionId}-${difficulty}`] || null;
  } catch {
    return null;
  }
}

export function saveQuizTime(regionId, difficulty, time, score, total) {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_TIMES) || '{}');
    const key = `${regionId}-${difficulty}`;
    const existing = data[key];

    // Only save if it's a perfect score and better time (or first time)
    if (score === total) {
      if (!existing || time < existing.time) {
        data[key] = { time, score, total, date: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEYS.QUIZ_TIMES, JSON.stringify(data));
        return true; // New record!
      }
    }
    return false;
  } catch {
    return false;
  }
}

export function getAllQuizTimes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_TIMES) || '{}');
  } catch {
    return {};
  }
}

// Learned countries/states tracking
export function getLearnedItems(regionId) {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEARNED) || '{}');
    return data[regionId] || [];
  } catch {
    return [];
  }
}

export function markAsLearned(regionId, code) {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEARNED) || '{}');
    if (!data[regionId]) {
      data[regionId] = [];
    }
    if (!data[regionId].includes(code)) {
      data[regionId].push(code);
      localStorage.setItem(STORAGE_KEYS.LEARNED, JSON.stringify(data));
    }
    return data[regionId];
  } catch {
    return [];
  }
}

export function getLearnProgress(regionId, totalCount) {
  const learned = getLearnedItems(regionId);
  return {
    learned: learned.length,
    total: totalCount,
    percentage: totalCount > 0 ? Math.round((learned.length / totalCount) * 100) : 0,
    items: learned,
  };
}

export function clearProgress() {
  localStorage.removeItem(STORAGE_KEYS.QUIZ_TIMES);
  localStorage.removeItem(STORAGE_KEYS.LEARNED);
}
