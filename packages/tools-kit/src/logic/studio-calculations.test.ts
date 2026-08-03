import { describe, expect, it } from 'vitest';
import { calculateCalculatorTool } from '../components/CalculatorToolsStudio';
import { calculateHealthTool } from '../components/HealthToolsStudio';
import { calculateTravelTool } from '../components/TravelToolsStudio';
import { calculateCreatorTool } from '../components/CreatorToolsStudio';
import { calculateEducationTool } from '../components/EducationToolsStudio';
import { calculateCareerTool } from '../components/CareerToolsStudio';
import { calculateProductivityTool } from '../components/ProductivityToolsStudio';
import { calculateHomeTool } from '../components/HomeToolsStudio';

describe('calculator studio formulas', () => {
  it('calculates percentage values and percentage change', () => {
    const result = calculateCalculatorTool('percentage', { value:'250', percent:'20', original:'200' });
    expect(result).toContain('20% of 250 = 50.00');
    expect(result).toContain('Change from 200 to 250: 25.00%');
  });
  it('calculates a zero-interest amortized payment', () => {
    expect(calculateCalculatorTool('loan', { principal:'120000', rate:'0', years:'1' })).toContain('Monthly payment: ৳10,000');
  });
  it('counts weekdays and entered weekday holidays', () => {
    const result = calculateCalculatorTool('working-days', { start:'2026-08-03', end:'2026-08-07', holidays:'2026-08-05' });
    expect(result).toContain('Working days: 4');
    expect(result).toContain('Entered weekday holidays: 1');
  });
  it('converts meeting time across UTC offsets', () => {
    expect(calculateCalculatorTool('timezone-meeting', { date:'2026-08-05', time:'14:00', origin:'+06:00', target:'-04:00' })).toContain('Target: 04:00');
  });
  it('settles unequal group expenses', () => {
    const result = calculateCalculatorTool('travel-group', { names:'A, B', paid:'100, 0' });
    expect(result).toContain('B pays A: ৳50');
  });
  it('rejects missing numeric values instead of treating them as zero', () => {
    expect(calculateCalculatorTool('loan', { principal:'', rate:'9', years:'5' })).toBe('Enter loan amount.');
  });
  it('rejects impossible percentage and duration inputs', () => {
    expect(calculateCalculatorTool('discount', { price:'1000', discount:'140' })).toBe('Discount must be between 0% and 100%.');
    expect(calculateCalculatorTool('loan', { principal:'1000', rate:'9', years:'0' })).toBe('Years must be greater than zero.');
  });
  it('requires one valid payment for every traveller', () => {
    expect(calculateCalculatorTool('travel-group', { names:'A, B', paid:'100' })).toBe('Enter one paid amount for every traveller, in the same order.');
  });
  it('rejects malformed or impossible UTC offsets', () => {
    expect(calculateCalculatorTool('timezone-meeting', { date:'2026-08-05', time:'14:00', origin:'Dhaka', target:'-04:00' })).toContain('UTC offsets must use');
    expect(calculateCalculatorTool('timezone-meeting', { date:'2026-08-05', time:'14:00', origin:'+15:00', target:'-04:00' })).toContain('UTC offsets must use');
  });
});

describe('health calculations and boundaries', () => {
  it('calculates BMI from metric inputs', () => expect(calculateHealthTool('bmi','70','170')).toContain('BMI: 24.2'));
  it('calculates a hydration baseline and activity adjustment', () => expect(calculateHealthTool('water','70','30')).toContain('Estimated total: 2.80 L/day'));
  it('creates reminders without suggesting a dose', () => {
    const result = calculateHealthTool('medicine','08:00','2\n7\nPrescribed medicine');
    expect(result).toContain('08:00'); expect(result).toContain('20:00'); expect(result).toContain('does not determine dose');
  });
});

describe('travel calculations', () => {
  it('calculates a buffered group travel budget', () => expect(calculateTravelTool('budget','2,5','1000,100,10')).toContain('Total trip budget: ৳2,200'));
  it('uses the explicitly entered currency rate', () => expect(calculateTravelTool('currency','1000,BDT','0.01,USD')).toContain('= 10 USD'));
  it('splits fuel and tolls', () => expect(calculateTravelTool('fuel-toll','120,12,100','500,3')).toContain('Per traveller: ৳500'));
});

describe('education and career calculations', () => {
  it('calculates grade percentage', () => expect(calculateEducationTool('grade','78','100')).toContain('Percentage: 78.00%'));
  it('calculates final exam requirement', () => expect(calculateEducationTool('final-grade','72','40\n80')).toContain('Required final exam grade: 92.00%'));
  it('detects an unreachable remaining-marks target', () => expect(calculateEducationTool('marks-needed','50','100\n90\n80')).toContain('no longer mathematically reachable'));
  it('compares annualized salary value', () => expect(calculateCareerTool('salary','100,10,0','90,0,0')).toContain('Stronger entered cash value: Offer A'));
  it('calculates a sustainable freelance rate', () => expect(calculateCareerTool('freelance','100000,0,0','20,50')).toContain('Minimum sustainable rate: ৳100/hour'));
});

describe('creator, productivity and home calculations', () => {
  it('calculates narration duration', () => {
    const script = Array.from({length:120},()=> 'word').join(' ');
    expect(calculateCreatorTool('script-timer',script,'120')).toContain('Estimated narration: 1:00');
  });
  it('calculates meeting cost', () => expect(calculateProductivityTool('meeting','4','500')).toContain('Cost per meeting hour: ৳2,000'));
  it('calculates tile count with waste', () => expect(calculateHomeTool('tile','2,2','0.5,0.5\n10')).toContain('With 10% waste: 18 tiles'));
  it('calculates solar panel count', () => expect(calculateHomeTool('solar','10','5\n20\n500')).toContain('500 W panels required: 5'));
});
