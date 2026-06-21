import React, { useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./index.css";

export default function Success() {
  const history = useHistory();
  const location = useLocation();
  const { regId, name } = location.state || {};
  const idCardRef = useRef(null);

  const downloadRegistrationCard = async () => {
    if (!idCardRef.current) return;

    try {
      // Try to load html2canvas if available
      const html2canvas = (await import(/* webpackIgnore: true */ 'html2canvas')).default;
      
      const canvas = await html2canvas(idCardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
      });

      // Add worship-themed background to the canvas
      const ctx = canvas.getContext('2d');
      
      // Create background with worship scene
      const bgCanvas = document.createElement('canvas');
      bgCanvas.width = canvas.width;
      bgCanvas.height = canvas.height;
      const bgCtx = bgCanvas.getContext('2d');
      
      // Create a worship scene background
      const bgGradient = bgCtx.createLinearGradient(0, 0, bgCanvas.width, bgCanvas.height);
      bgGradient.addColorStop(0, '#1a365d'); // Deep blue
      bgGradient.addColorStop(0.3, '#2d3748'); // Dark gray
      bgGradient.addColorStop(0.7, '#4a5568'); // Medium gray
      bgGradient.addColorStop(1, '#2d3748'); // Dark gray
      bgCtx.fillStyle = bgGradient;
      bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
      
      // Add subtle cross pattern
      bgCtx.strokeStyle = 'rgba(255, 215, 0, 0.1)';
      bgCtx.lineWidth = 2;
      bgCtx.beginPath();
      bgCtx.moveTo(bgCanvas.width / 2, bgCanvas.height * 0.2);
      bgCtx.lineTo(bgCanvas.width / 2, bgCanvas.height * 0.8);
      bgCtx.moveTo(bgCanvas.width * 0.3, bgCanvas.height / 2);
      bgCtx.lineTo(bgCanvas.width * 0.7, bgCanvas.height / 2);
      bgCtx.stroke();
      
      // Add worship hands silhouettes
      bgCtx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      bgCtx.font = '80px Arial';
      bgCtx.textAlign = 'center';
      bgCtx.fillText('🙏', bgCanvas.width * 0.25, bgCanvas.height * 0.3);
      bgCtx.fillText('🙏', bgCanvas.width * 0.75, bgCanvas.height * 0.7);
      
      // Add church building silhouette
      bgCtx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      bgCtx.font = '60px Arial';
      bgCtx.fillText('⛪', bgCanvas.width / 2, bgCanvas.height * 0.85);
      
      // Composite the background with the card content
      ctx.globalCompositeOperation = 'destination-over';
      ctx.drawImage(bgCanvas, 0, 0);
      ctx.globalCompositeOperation = 'source-over';

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `GatherFlow-Registration-${regId || 'ID'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
      
      // Fallback: Create realistic worship card PNG
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Card dimensions for mobile (similar to ID card)
        canvas.width = 600;
        canvas.height = 380;
        
        // Create worship background
        const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        bgGradient.addColorStop(0, '#1a365d'); // Deep blue
        bgGradient.addColorStop(0.3, '#2d3748'); // Dark gray
        bgGradient.addColorStop(0.7, '#4a5568'); // Medium gray
        bgGradient.addColorStop(1, '#2d3748'); // Dark gray
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add cross pattern
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.15)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height * 0.15);
        ctx.lineTo(canvas.width / 2, canvas.height * 0.85);
        ctx.moveTo(canvas.width * 0.25, canvas.height / 2);
        ctx.lineTo(canvas.width * 0.75, canvas.height / 2);
        ctx.stroke();
        
        // Add worship elements
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.font = '50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🙏', canvas.width * 0.2, canvas.height * 0.25);
        ctx.fillText('🙏', canvas.width * 0.8, canvas.height * 0.75);
        
        // Add church
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.font = '40px Arial';
        ctx.fillText('⛪', canvas.width / 2, canvas.height * 0.9);
        
        // Card border
        ctx.strokeStyle = '#e8a020';
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        
        // Inner content area with white background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(30, 30, canvas.width - 60, canvas.height - 60);
        
        // Header with church icon
        ctx.fillStyle = '#1a365d';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⛪ GATHERFLOW CHURCH', canvas.width / 2, 70);
        
        // Registration ID
        ctx.fillStyle = '#4a5568';
        ctx.font = '16px Arial';
        ctx.fillText('REGISTRATION CARD', canvas.width / 2, 100);
        
        // ID Number
        ctx.fillStyle = '#1a365d';
        ctx.font = 'bold 32px monospace';
        ctx.fillText(regId || '0000000000', canvas.width / 2, 140);
        
        // Name
        if (name) {
          ctx.fillStyle = '#2d3748';
          ctx.font = '18px Arial';
          ctx.fillText(`Name: ${name}`, canvas.width / 2, 180);
        }
        
        // Date
        const date = new Date().toLocaleDateString("en-IN", { 
          year: "numeric", 
          month: "long", 
          day: "numeric" 
        });
        ctx.fillStyle = '#4a5568';
        ctx.font = '14px Arial';
        ctx.fillText(`Date: ${date}`, canvas.width / 2, 210);
        
        // Instructions
        ctx.fillStyle = '#2d3748';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Please present this card at the event entrance', canvas.width / 2, 250);
        
        // Footer
        ctx.fillStyle = '#4a5568';
        ctx.font = '12px Arial';
        ctx.fillText('GatherFlow Church Event Registration', canvas.width / 2, 280);
        ctx.fillText('www.gatherflow.church', canvas.width / 2, 300);
        
        // Download the canvas
        canvas.toBlob(blob => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `GatherFlow-Registration-${regId || 'ID'}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        });
      } catch (fallbackErr) {
        console.error("Fallback download also failed:", fallbackErr);
        // Last resort: show message
        alert(`Registration ID: ${regId || '0000000000'}\n\nTo save your registration:\n1. Take a screenshot\n2. Or copy the ID above`);
      }
    }
  };

  return (
    <div className="success-wrapper">
      <div className="success-bg" />
      
      <div className="success-container">
        {/* Animated celebration elements */}
        <div className="celebration-confetti">
          <div className="confetti-piece" style={{ animationDelay: "0s" }}>✨</div>
          <div className="confetti-piece" style={{ animationDelay: "0.15s" }}>🎁</div>
          <div className="confetti-piece" style={{ animationDelay: "0.3s" }}>✨</div>
          <div className="confetti-piece" style={{ animationDelay: "0.45s" }}>🎊</div>
          <div className="confetti-piece" style={{ animationDelay: "0.6s" }}>✨</div>
        </div>

        {/* Main success card */}
        <div className="success-card">
          {/* Animated checkmark */}
          <div className="success-icon">
            <svg viewBox="0 0 100 100" width="80" height="80">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#059669" strokeWidth="2" className="success-circle" />
              <path d="M 30 50 L 45 65 L 70 35" fill="none" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="success-checkmark" />
            </svg>
          </div>

          <h1 className="success-title">You're Registered!</h1>
          
          <p className="success-subtitle">
            Welcome to GatherFlow{name ? `, ${name}` : ""}! 🙏
          </p>
          
          <p className="success-message">
            Thank you for joining our community. We're excited to have you with us!
          </p>

          {/* Registration ID Card */}
          <div ref={idCardRef} className="registration-card">
            <div className="card-header">
              <span className="church-icon">⛪</span>
              <h2>GatherFlow Church</h2>
            </div>
            
            <div className="card-content">
              <p className="card-label">Event Registration Card</p>
              <p className="card-id">{regId || "0000000000"}</p>
              {name && <p className="card-name">Attendee: {name}</p>}
              <p className="card-date">
                Date: {new Date().toLocaleDateString("en-IN", { 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                })}
              </p>
            </div>

            <div className="card-footer">
              <p>Please present this card at the church event entrance</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="button-group">
            <button className="btn-download" onClick={downloadRegistrationCard}>
              <span className="download-icon">⬇️</span> Download Registration Card
            </button>
            
            <button 
              className="btn-register-again" 
              onClick={() => history.push("/")}
            >
              Register Another Person
            </button>
          </div>

          <p className="success-footer">
            Keep your Registration ID safe. You'll need it at the event entrance!
          </p>
        </div>
      </div>
    </div>
  );
}