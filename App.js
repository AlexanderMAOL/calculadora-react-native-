import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, StatusBar, ScrollView } from 'react-native';
import { evaluate, sin, cos, tan, log, sqrt, pi } from 'mathjs';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [clearCount, setClearCount] = useState(0); // Estado para contar presiones en "C"

  const handlePress = (value) => {
    const lastChar = input[input.length - 1];

    if (['+', '-', '*', '/', '^'].includes(value)) {
      if (input.length === 0 || ['+', '-', '*', '/', '^'].includes(lastChar)) {
        return;
      }
    }

    setInput((prevInput) => prevInput + value);
  };

  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const calculateResult = () => {
    try {
      // Verificar división por cero
      if (input.includes('/0')) {
        setResult('Error: División por cero');
        return;
      }

      // Verificar raíces de números negativos
      const squareRootMatches = input.match(/sqrt\((-?\d+(\.\d+)?)\)/g);
      if (squareRootMatches) {
        for (const match of squareRootMatches) {
          const number = parseFloat(match.replace(/sqrt\((.*)\)/, '$1'));
          if (number < 0) {
            setResult('Error: Raíz de número negativo');
            return;
          }
        }
      }

      let modifiedInput = input
        .replace(/sin\(([^)]+)\)/g, (match, p1) => `sin(${toRadians(parseFloat(p1))})`)
        .replace(/cos\(([^)]+)\)/g, (match, p1) => `cos(${toRadians(parseFloat(p1))})`)
        .replace(/tan\(([^)]+)\)/g, (match, p1) => `tan(${toRadians(parseFloat(p1))})`);

      const evaluated = evaluate(modifiedInput);
      setResult(evaluated.toString());
      setHistory((prevHistory) => [...prevHistory, `${modifiedInput} = ${evaluated}`]);
      setInput('');
    } catch (error) {
      setResult('Error');
    }
  };

  const clearInput = () => {
    setInput('');
    setResult('');
  };

  const deleteLastCharacter = () => {
    setInput((prevInput) => prevInput.slice(0, -1));
  };

  const handleClearPress = () => {
    setClearCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount === 1) {
        setTimeout(() => setClearCount(0), 300);
      }
      if (newCount === 2) {
        setHistory([]);
        return 0;
      }
      return newCount;
    });
    clearInput();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light-content" />
      
      <ScrollView style={styles.historyContainer}>
        {history.map((item, index) => (
          <Text key={index} style={styles.historyText}>{item}</Text>
        ))}
      </ScrollView>

      <View style={styles.displayContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="0" 
          placeholderTextColor="#999" 
          value={input} 
          editable={false}
        />
        <Text style={styles.result}>{result}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.buttonsContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('sin(')}>
            <Text style={styles.buttonText}>sin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('cos(')}>
            <Text style={styles.buttonText}>cos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('tan(')}>
            <Text style={styles.buttonText}>tan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('log(')}>
            <Text style={styles.buttonText}>log</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('^')}>
            <Text style={styles.buttonText}>^</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('sqrt(')}>
            <Text style={styles.buttonText}>√</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('(')}>
            <Text style={styles.buttonText}>(</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePress(')')}>
            <Text style={styles.buttonText}>)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('7')}>
            <Text style={styles.buttonText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('8')}>
            <Text style={styles.buttonText}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('9')}>
            <Text style={styles.buttonText}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('/')}>
            <Text style={styles.buttonText}>/</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('4')}>
            <Text style={styles.buttonText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('5')}>
            <Text style={styles.buttonText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('6')}>
            <Text style={styles.buttonText}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('*')}>
            <Text style={styles.buttonText}>*</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('1')}>
            <Text style={styles.buttonText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('2')}>
            <Text style={styles.buttonText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('3')}>
            <Text style={styles.buttonText}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('-')}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.buttonZero} onPress={() => handlePress('0')}>
            <Text style={styles.buttonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('.')}>
            <Text style={styles.buttonText}>.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('+')}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={deleteLastCharacter}>
            <Text style={styles.buttonText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonClear} onPress={handleClearPress}>
            <Text style={styles.buttonText}>C</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonEqual} onPress={calculateResult}>
            <Text style={styles.buttonText}>=</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282c34',
    justifyContent: 'center',
  },
  historyContainer: {
    maxHeight: 100,
    padding: 10,
  },
  historyText: {
    color: '#fff',
    fontSize: 16,
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 20,
  },
  input: {
    fontSize: 40,
    color: '#fff',
    width: '100%',
    textAlign: 'right',
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  result: {
    fontSize: 30,
    color: '#9174ba',
    marginTop:
10,
  },
  buttonsContainer: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    flexWrap: 'wrap', 
  },
  button: {
    backgroundColor: '#9174ba',
    padding: 20,
    width: '22%', 
    height: 60,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonZero: {
    backgroundColor: '#9174ba',
    padding: 20,
    width: '47%',
    height: 60,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonClear: {
    backgroundColor: '#000000',
    padding: 20,
    width: '22%',
    height: 60,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonEqual: {
    backgroundColor: '#000000',
    padding: 20,
    width: '47%',
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
    adjustsFontSizeToFit: true,
  },
});
