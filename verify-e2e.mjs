async function verify() {
  const res = await fetch('http://localhost:3000/api/generate-quiz', {
    method: 'POST',
    body: (function() {
      const fd = new FormData();
      fd.append('useSample', 'true');
      return fd;
    })()
  });
  const data = await res.json();
  console.log('Quiz title:', data.quiz?.title);
  console.log('Questions count:', data.quiz?.questions?.length);
  for (const q of data.quiz?.questions || []) {
    console.log(`Q${q.id} [${q.difficulty}] (${q.topic}): ${q.question.slice(0, 60)}... Correct: ${q.correctAnswer}`);
    console.log('   Options count:', q.options.length, 'Sample:', q.options[0]);
  }
}
verify().catch(console.error);
