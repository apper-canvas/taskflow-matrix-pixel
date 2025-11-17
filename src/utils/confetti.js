export const createConfetti = () => {
  const colors = ["#ec4899", "#8b5cf6", "#6366f1", "#10b981", "#f59e0b"]
  const confettiCount = 50
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div")
    confetti.className = "confetti"
    confetti.style.left = Math.random() * 100 + "vw"
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    confetti.style.animationDelay = Math.random() * 3 + "s"
    confetti.style.animationDuration = (Math.random() * 3 + 2) + "s"
    
    document.body.appendChild(confetti)
    
    setTimeout(() => {
      confetti.remove()
    }, 6000)
  }
}