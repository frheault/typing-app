import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TypingTest from '../TypingTest'; 
import { vi } from 'vitest';

// Mock sentenceStore
const mockSentenceStoreActions = {
  setSentence: vi.fn(), setInput: vi.fn(), addError: vi.fn(), removeError: vi.fn(),
  nextWord: vi.fn(), previousWord: vi.fn(), startTest: vi.fn(), endTest: vi.fn(),
  resetTest: vi.fn(), loadSentenceFromLocalStorage: vi.fn(), saveSentenceToLocalStorage: vi.fn(),
};
const initialMockedStoreState = {
  sentence: 'hello world store default', typedSentence: '', errorIndices: [], currentWordIndex: 0,
  currentSentenceIndex: 0, totalWords: 'hello world store default'.split(' ').length,
  totalCharacters: 'hello world store default'.length, startTime: null, endTime: null,
  isRunning: false, isFinished: false,
};
vi.mock('../../store/sentenceStore', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(() => ({ ...initialMockedStoreState, ...mockSentenceStoreActions })),
  useSentenceStore: vi.fn().mockImplementation(() => ({ ...initialMockedStoreState, ...mockSentenceStoreActions })),
}));

vi.mock('../Result', () => ({
  default: vi.fn(({ cpm, accuracy, originalText, userInput }) => (
    <div data-testid="result-component">
      <p>CPM: {cpm}</p><p>Accuracy: {accuracy}%</p>
      <p>Original: {originalText}</p><p>User: {userInput}</p>
    </div>
  )),
}));

const originalLocation = window.location;
beforeAll(() => {
  // @ts-ignore
  delete window.location;
  window.location = { ...originalLocation, reload: vi.fn() };
});
afterAll(() => { window.location = originalLocation; });

import useSentenceStore from '../../store/sentenceStore';

describe('TypingTest', () => {
  const defaultTestTextProp = 'hello world prop'; 
  const defaultProps = {
    text: defaultTestTextProp,
    eclipsedTime: Infinity, 
    language: 'plaintext' as string | undefined,
  };
  
  let currentMockStoreState: typeof initialMockedStoreState & typeof mockSentenceStoreActions;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] });
    // @ts-ignore
    window.location.reload.mockClear(); 
    Object.values(mockSentenceStoreActions).forEach(mockFn => mockFn.mockClear());
    
    currentMockStoreState = {
      ...initialMockedStoreState, sentence: defaultTestTextProp, 
      totalWords: defaultTestTextProp.split(' ').length, totalCharacters: defaultTestTextProp.length,
      typedSentence: '', errorIndices: [], currentWordIndex: 0, currentSentenceIndex: 0,
      startTime: null, endTime: null, isRunning: false, isFinished: false,
      ...mockSentenceStoreActions,
    };

    const mockedUseSentenceStore = useSentenceStore as vi.Mock;
    mockedUseSentenceStore.mockReturnValue(currentMockStoreState);

    // Mock store action implementations
    mockSentenceStoreActions.setInput.mockImplementation((input) => {
        currentMockStoreState.typedSentence = input;
        if (!currentMockStoreState.isRunning && input.length > 0) {
            currentMockStoreState.isRunning = true; currentMockStoreState.startTime = Date.now();
        }
        if (input === currentMockStoreState.sentence) {
            currentMockStoreState.isFinished = true; currentMockStoreState.isRunning = false; currentMockStoreState.endTime = Date.now();
        }
    });
    mockSentenceStoreActions.startTest.mockImplementation(() => {
        currentMockStoreState.isRunning = true; currentMockStoreState.startTime = Date.now();
    });
    mockSentenceStoreActions.endTest.mockImplementation(() => {
        currentMockStoreState.isRunning = false; currentMockStoreState.isFinished = true; currentMockStoreState.endTime = Date.now();
    });
    mockSentenceStoreActions.resetTest.mockImplementation(() => {
        currentMockStoreState.typedSentence = ''; currentMockStoreState.errorIndices = [];
        currentMockStoreState.currentWordIndex = 0; currentMockStoreState.startTime = null;
        currentMockStoreState.endTime = null; currentMockStoreState.isRunning = false; currentMockStoreState.isFinished = false;
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers(); 
    vi.useRealTimers(); 
  });

  it('renders initial elements correctly', () => {
    render(<TypingTest {...defaultProps} />);
    const displayArea = screen.getByTestId('text-display-area');
    
    expect(within(displayArea).getAllByText('h')[0]).toBeInTheDocument();
    expect(within(displayArea).getAllByText('e')[0]).toBeInTheDocument();
    expect(within(displayArea).getAllByText('l').length).toBe(3);
    expect(within(displayArea).getAllByText('o').length).toBe(3); 
    expect(within(displayArea).getAllByText('w')[0]).toBeInTheDocument();
    expect(within(displayArea).getAllByText('r').length).toBe(2); 
    expect(within(displayArea).getAllByText('d')[0]).toBeInTheDocument();
    expect(within(displayArea).getAllByText('p').length).toBe(2); 

    const allSpansInDisplay = displayArea.querySelectorAll('div.flex.flex-wrap > span');
    let spaceCount = 0;
    allSpansInDisplay.forEach(span => { if (span.textContent === '\u00A0') spaceCount++; });
    expect(spaceCount).toBe(2); 
        
    const statsContainer = screen.getByText('Précision :').closest('div.flex.items-center.gap-2.w-full');
    expect(statsContainer).toBeInTheDocument();

    const timerDiv = statsContainer!.querySelector(':scope > div:nth-child(1)'); 
    expect(timerDiv!.querySelector('svg.lucide-clock')).toBeInTheDocument();
    expect(within(timerDiv as HTMLElement).getByText('0')).toBeInTheDocument();

    const accuracyDiv = statsContainer!.querySelector(':scope > div:nth-child(2)');
    expect(within(accuracyDiv as HTMLElement).getByText('0%')).toBeInTheDocument();
    
    const cpmDiv = statsContainer!.querySelector(':scope > div:nth-child(3)');
    expect(within(cpmDiv as HTMLElement).getByText('0')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Soumettre \/ Terminer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Réinitialiser l'entraînement/i })).toBeInTheDocument();
  });
  
  it('displays the provided text to practice from prop', () => {
    const textToVerify = "another example sentence";
    render(<TypingTest {...defaultProps} text={textToVerify} />); 
    const displayArea = screen.getByTestId('text-display-area');
    const renderedSpans = displayArea.querySelectorAll('div.flex.flex-wrap > span'); 
    let textFromSpans = "";
    renderedSpans.forEach(span => {
        const spanText = span.textContent;
        if (spanText === '\u00A0') textFromSpans += ' '; 
        else if (spanText === '\u00A0\u00A0\u00A0\u00A0') textFromSpans += '\t'; 
        else textFromSpans += spanText;
    });
    expect(textFromSpans).toBe(textToVerify);
  });

  it('handles correct character input and updates styling', () => { 
    render(<TypingTest {...defaultProps} text="hi" />); 
    const displayArea = screen.getByTestId('text-display-area');
    const hSpan = within(displayArea).getByText('h');
    act(() => { fireEvent.keyDown(window, { key: 'h' }); });
    expect(hSpan).toHaveClass('text-emerald-500');
    const iSpan = within(displayArea).getByText('i');
    expect(iSpan).toHaveClass('border-blue-500'); 
  });

  it('handles incorrect character input and updates styling', () => { 
    render(<TypingTest {...defaultProps} text="hi" />); 
    const displayArea = screen.getByTestId('text-display-area');
    const hSpan = within(displayArea).getByText('h');
    act(() => { fireEvent.keyDown(window, { key: 'x' }); });
    expect(hSpan).toHaveClass('text-red-500');
  });
  
  it('handles Backspace key correctly', () => { 
    render(<TypingTest {...defaultProps} text="hot" />); 
    const displayArea = screen.getByTestId('text-display-area');
    act(() => { fireEvent.keyDown(window, { key: 'h' }); });
    act(() => { fireEvent.keyDown(window, { key: 'o' }); });
    act(() => { fireEvent.keyDown(window, { key: 't' }); });
    const tSpan = within(displayArea).getByText('t'); 
    expect(tSpan).toHaveClass('text-emerald-500');
    act(() => { fireEvent.keyDown(window, { key: 'Backspace' }); });
    expect(tSpan).not.toHaveClass('text-emerald-500');
    expect(tSpan).toHaveClass('border-blue-500'); 
    const oSpan = within(displayArea).getByText('o');
    expect(oSpan).toHaveClass('text-emerald-500');
  });

  it('starts timer on first valid key press and updates timer display', async () => {
    render(<TypingTest {...defaultProps} />);
    const statsContainer = screen.getByText('Précision :').closest('div.flex.items-center.gap-2.w-full');
    const timerDiv = statsContainer!.querySelector(':scope > div:nth-child(1)');
    const timerValueDisplay = within(timerDiv as HTMLElement).getByText('0');
    
    act(() => { fireEvent.keyDown(window, { key: 'h' }); });
    await act(async () => { vi.advanceTimersByTime(1000); });
    await waitFor(() => expect(timerValueDisplay).toHaveTextContent('1'), {timeout: 2500});
    
    await act(async () => { vi.advanceTimersByTime(2000); });
    await waitFor(() => expect(timerValueDisplay).toHaveTextContent('3'), {timeout: 3500});
  }, 7000); 

  it('calculates and displays CPM and Accuracy after typing (simplified)', async () => {
    render(<TypingTest {...defaultProps} text="hi" />); 
    const statsContainer = screen.getByText('Précision :').closest('div.flex.items-center.gap-2.w-full');
    const accuracyDiv = statsContainer!.querySelector(':scope > div:nth-child(2)');
    const cpmDiv = statsContainer!.querySelector(':scope > div:nth-child(3)');
        
    act(() => { fireEvent.keyDown(window, { key: 'h' }); });
    await act(async () => { vi.advanceTimersByTime(1000); });
        
    await waitFor(() => {
      expect(within(accuracyDiv as HTMLElement).getByText('100%')).toBeInTheDocument(); 
      expect(within(cpmDiv as HTMLElement).getByText('60')).toBeInTheDocument();   
    });

    act(() => { fireEvent.keyDown(window, { key: 'i' }); });
    await act(async () => { vi.advanceTimersByTime(1000); });

    await waitFor(() => {
      expect(within(accuracyDiv as HTMLElement).getByText('100%')).toBeInTheDocument(); 
      expect(within(cpmDiv as HTMLElement).getByText('60')).toBeInTheDocument(); 
    });
  }, 10000); 
  
  it('submits and shows Result component when "Soumettre / Terminer" is clicked', async () => {
    render(<TypingTest {...defaultProps} text="test" />); 
    act(() => { fireEvent.keyDown(window, { key: 't' }); });
    const submitButton = screen.getByRole('button', { name: /Soumettre \/ Terminer/i });
    await userEvent.click(submitButton); 
    await waitFor(() => {
      expect(screen.getByTestId('result-component')).toBeInTheDocument();
      expect(screen.getByText('Original: test')).toBeInTheDocument();
      expect(screen.getByText('User: t')).toBeInTheDocument(); 
    }, { timeout: 10000 });
  }, 10000);

  it('calls window.location.reload when "Réinitialiser l\'entraînement" is clicked', async () => {
    render(<TypingTest {...defaultProps} />);
    const resetButton = screen.getByRole('button', { name: /Réinitialiser l'entraînement/i });
    await userEvent.click(resetButton); 
    expect(window.location.reload).toHaveBeenCalled();
  }, 10000);

  it('auto-submits when eclipsedTime is reached', async () => {
    render(<TypingTest {...defaultProps} text="text" eclipsedTime={2} />); 
    act(() => { fireEvent.keyDown(window, { key: 't' }); }); 
    await act(async () => { vi.advanceTimersByTime(1000); }); 
    expect(screen.queryByTestId('result-component')).not.toBeInTheDocument();
    await act(async () => { vi.advanceTimersByTime(1000); }); 
    await waitFor(() => expect(screen.getByTestId('result-component')).toBeInTheDocument(), { timeout: 10000 });
  }, 15000); 
  
  // Syntax highlighting test remains commented out
  // it('renders syntax highlighting for Python keywords (simplified check)', () => { ... });
});
