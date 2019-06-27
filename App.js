/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, Dimensions, TextInput, TouchableOpacity} from 'react-native';
import { getDataFromLocal, saveDataToStorage } from './helper'

export default class App extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      todoText: '',
      showEdit: false,
      editItemDetails: {}
    }
    this.inputRef = React.createRef();
  }

  async componentDidMount() {
    const dataSource = await getDataFromLocal('todoList');
    this.setState({
      dataSource: JSON.parse(dataSource) || []
    })
  }

  editItem = () => {
    // let newItem = {...item};
    let { editItemDetails, todoText } = this.state;
    editItemDetails.name = todoText;
    let data = [...this.state.dataSource];
    data[editItemDetails.index] = editItemDetails;
    this.inputRef.current.setNativeProps({ text: '' })
    if(todoText != '') {
      this.setState({
        dataSource: data,
        showEdit: false,
        todoText: ''
      })
      saveDataToStorage('todoList', JSON.stringify(data))
    }
  }

  editInit = (item, index) => {
    this.inputRef.current.setNativeProps({ text: item.name })
    this.inputRef.current.focus();
    this.setState({
      showEdit: true,
      editItemDetails: {...item,index}
    })
  }

  deleteItem = (i) => {
    const data = [...this.state.dataSource];
    data.splice(i,1);
    this.setState({
      dataSource: data
    })
    saveDataToStorage('todoList', JSON.stringify(data))
  }

  addItem = () => {
    const { todoText } = this.state;
    const obj = { name: todoText };
    const data = [...this.state.dataSource];
    data.push(obj);
    this.inputRef.current.clear();
    if(todoText != '') {
      this.setState({
        dataSource: data,
        todoText: ''
      })
      saveDataToStorage('todoList', JSON.stringify(data))
    }
  }

  cancelEdit = () => {
    this.inputRef.current.setNativeProps({ text: '' })
    this.setState({
      todoText: '',
      showEdit: false
    })
  }

  renderItem = ({item, index}) => {
    return (
      <View key={item.name + index} style={styles.listViewContainer}>
        <Text style={{ width: '20%' }}>{item.name}</Text>
        <View style={styles.rowOperationContainer}>
          <Text style={{ marginRight: 10 }} onPress={() => this.editInit(item, index)}>edit</Text>
          <Text onPress={() => this.deleteItem(index)}>Delete</Text>
        </View>
      </View>
    )
  }

  updateText = (todoText) => {
    this.setState({
      todoText
    })
  }

  addAndUpdateTodo = () => {
    const { showEdit } = this.state
    return (
      <View style={styles.addTodoContainer}>
        <TextInput placeholder="Add todo item" style={styles.input} ref={this.inputRef} onChangeText={this.updateText} />
        {showEdit ? null :
        <TouchableOpacity onPress={this.addItem} style={styles.button}>
          <Text>
            Add
          </Text>
        </TouchableOpacity> }
        {showEdit ?
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={{ marginRight: 100 }} onPress={this.editItem} style={styles.button}>
            <Text>
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.cancelEdit} style={styles.button}>
            <Text>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
        : null }
      </View>
    )
  }

  render() {
    const { dataSource } = this.state
    return (
      <View style={styles.container}>
        {this.addAndUpdateTodo()}
        <FlatList
          data={dataSource}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => item.name + index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  listViewContainer: {
    width: Dimensions.get('window').width,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  addTodoContainer: {
    width: Dimensions.get('window').width,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  button: {
    height: 50,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey'
  },
  input: {
    height: 50,
    width: 100,
    borderBottomWidth: 1
  },
  rowOperationContainer: {
    flexDirection: 'row'
  }
});
