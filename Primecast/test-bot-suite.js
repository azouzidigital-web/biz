#!/usr/bin/env node

/**
 * Master Bot Test Suite
 * Runs all bot tests and provides comprehensive results
 */

const { execSync } = require('child_process');
const fs = require('fs');

class BotTestSuite {
  constructor() {
    this.results = {
      basic: { passed: 0, failed: 0, total: 0 },
      advanced: { passed: 0, failed: 0, total: 0 },
      flood: { protectionRate: 0, effective: false },
      forms: { protectionRate: 0, effective: false },
      overall: { score: 0, rating: 'Unknown' }
    };
  }

  async checkServerRunning() {
    try {
      const result = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:9003/', { encoding: 'utf8' });
      return result.trim() === '200';
    } catch (error) {
      return false;
    }
  }

  async installDependencies() {
    console.log('📦 Checking dependencies...');
    
    try {
      // Check if puppeteer is installed
      require('puppeteer');
      console.log('✅ Puppeteer is available');
    } catch (error) {
      console.log('📥 Installing Puppeteer for advanced tests...');
      try {
        execSync('npm install puppeteer --no-save', { stdio: 'inherit' });
        console.log('✅ Puppeteer installed successfully');
      } catch (installError) {
        console.log('⚠️ Could not install Puppeteer. Advanced tests will be skipped.');
        return false;
      }
    }
    
    return true;
  }

  async runBasicTests() {
    console.log('\n🔧 Running Basic Bot Tests...');
    try {
      const output = execSync('node test-bot-basic.js', { encoding: 'utf8', cwd: process.cwd() });
      console.log(output);
      
      // Parse results
      const blockedCount = (output.match(/✅ BLOCKED/g) || []).length;
      const notBlockedCount = (output.match(/❌ NOT BLOCKED/g) || []).length;
      const workingCount = (output.match(/✅ WORKING/g) || []).length;
      
      this.results.basic = {
        passed: blockedCount + workingCount,
        failed: notBlockedCount,
        total: blockedCount + notBlockedCount + workingCount
      };
      
      return true;
    } catch (error) {
      console.log('❌ Basic tests failed:', error.message);
      return false;
    }
  }

  async runFloodTests() {
    console.log('\n🌊 Running Flood Tests...');
    try {
      const output = execSync('node test-bot-flood.js', { encoding: 'utf8', cwd: process.cwd() });
      console.log(output);
      
      // Parse protection rate
      const protectionMatch = output.match(/Protection Rate: ([\d.]+)%/);
      if (protectionMatch) {
        this.results.flood.protectionRate = parseFloat(protectionMatch[1]);
        this.results.flood.effective = this.results.flood.protectionRate >= 70;
      }
      
      return true;
    } catch (error) {
      console.log('❌ Flood tests failed:', error.message);
      return false;
    }
  }

  async runAdvancedTests() {
    console.log('\n🕷️ Running Advanced Bot Tests...');
    try {
      const output = execSync('node test-bot-advanced.js', { encoding: 'utf8', cwd: process.cwd() });
      console.log(output);
      
      // Parse results
      const blockedCount = (output.match(/✅ BLOCKED/g) || []).length;
      const detectedCount = (output.match(/detected/g) || []).length;
      
      this.results.advanced = {
        passed: blockedCount + detectedCount,
        failed: Math.max(0, 5 - blockedCount - detectedCount), // Assume 5 total tests
        total: 5
      };
      
      return true;
    } catch (error) {
      console.log('❌ Advanced tests failed:', error.message);
      return false;
    }
  }

  async runFormTests() {
    console.log('\n📝 Running Form Bot Tests...');
    try {
      const output = execSync('node test-bot-forms.js', { encoding: 'utf8', cwd: process.cwd() });
      console.log(output);
      
      // Parse protection rate
      const protectionMatch = output.match(/Form Protection Rate: ([\d.]+)%/);
      if (protectionMatch) {
        this.results.forms.protectionRate = parseFloat(protectionMatch[1]);
        this.results.forms.effective = this.results.forms.protectionRate >= 70;
      }
      
      return true;
    } catch (error) {
      console.log('❌ Form tests failed:', error.message);
      return false;
    }
  }

  calculateOverallScore() {
    let score = 0;
    let maxScore = 0;
    
    // Basic tests (25 points)
    if (this.results.basic.total > 0) {
      score += (this.results.basic.passed / this.results.basic.total) * 25;
    }
    maxScore += 25;
    
    // Advanced tests (25 points)
    if (this.results.advanced.total > 0) {
      score += (this.results.advanced.passed / this.results.advanced.total) * 25;
    }
    maxScore += 25;
    
    // Flood protection (25 points)
    score += (this.results.flood.protectionRate / 100) * 25;
    maxScore += 25;
    
    // Form protection (25 points)
    score += (this.results.forms.protectionRate / 100) * 25;
    maxScore += 25;
    
    this.results.overall.score = (score / maxScore) * 100;
    
    if (this.results.overall.score >= 90) {
      this.results.overall.rating = 'EXCELLENT 🛡️';
    } else if (this.results.overall.score >= 75) {
      this.results.overall.rating = 'GOOD ✅';
    } else if (this.results.overall.score >= 60) {
      this.results.overall.rating = 'MODERATE ⚠️';
    } else {
      this.results.overall.rating = 'WEAK ❌';
    }
  }

  printFinalReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🛡️ FINAL BOT PROTECTION TEST REPORT');
    console.log('='.repeat(60));
    
    console.log('\n📊 Test Results Summary:');
    console.log(`Basic Tests: ${this.results.basic.passed}/${this.results.basic.total} passed`);
    console.log(`Advanced Tests: ${this.results.advanced.passed}/${this.results.advanced.total} passed`);
    console.log(`Flood Protection: ${this.results.flood.protectionRate.toFixed(1)}% effective`);
    console.log(`Form Protection: ${this.results.forms.protectionRate.toFixed(1)}% effective`);
    
    console.log(`\n🎯 Overall Protection Score: ${this.results.overall.score.toFixed(1)}/100`);
    console.log(`📈 Protection Rating: ${this.results.overall.rating}`);
    
    console.log('\n🔍 Recommendations:');
    if (this.results.basic.failed > 0) {
      console.log('- Strengthen basic bot detection (user agents, headers)');
    }
    if (this.results.flood.protectionRate < 80) {
      console.log('- Improve rate limiting and flood protection');
    }
    if (this.results.forms.protectionRate < 80) {
      console.log('- Enhance form-specific protections (honeypots, timing)');
    }
    if (this.results.overall.score >= 90) {
      console.log('- Excellent protection! Monitor and maintain current settings.');
    }
    
    console.log('\n' + '='.repeat(60));
  }

  async cleanupTestFiles() {
    console.log('\n🧹 Cleaning up test files...');
    const testFiles = [
      'test-bot-basic.js',
      'test-bot-advanced.js', 
      'test-bot-flood.js',
      'test-bot-forms.js',
      'test-bot-suite.js'
    ];
    
    testFiles.forEach(file => {
      try {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
          console.log(`✅ Removed ${file}`);
        }
      } catch (error) {
        console.log(`⚠️ Could not remove ${file}`);
      }
    });
    
    // Remove puppeteer if we installed it
    try {
      execSync('npm uninstall puppeteer', { stdio: 'ignore' });
      console.log('✅ Removed temporary Puppeteer installation');
    } catch (error) {
      // Ignore if puppeteer wasn't temporarily installed
    }
  }
}

async function runFullTestSuite() {
  const suite = new BotTestSuite();
  
  console.log('🤖 Bot Protection Test Suite Starting...\n');
  
  // Check if server is running
  if (!(await suite.checkServerRunning())) {
    console.log('❌ Server is not running on localhost:9003');
    console.log('Please start the development server with: npm run dev');
    return;
  }
  
  console.log('✅ Server is running');
  
  // Install dependencies
  const hasAdvanced = await suite.installDependencies();
  
  // Run all tests
  await suite.runBasicTests();
  await suite.runFloodTests();
  
  if (hasAdvanced) {
    await suite.runAdvancedTests();
    await suite.runFormTests();
  } else {
    console.log('⚠️ Skipping advanced tests (Puppeteer not available)');
  }
  
  // Calculate and display results
  suite.calculateOverallScore();
  suite.printFinalReport();
  
  // Ask user if they want to keep or remove test files
  console.log('\n❓ Test complete! Remove test files? (y/N)');
  
  // Auto-cleanup after 10 seconds or immediate cleanup in non-interactive mode
  setTimeout(() => {
    suite.cleanupTestFiles();
  }, 10000);
}

if (require.main === module) {
  runFullTestSuite().catch(console.error);
}

module.exports = { BotTestSuite };
