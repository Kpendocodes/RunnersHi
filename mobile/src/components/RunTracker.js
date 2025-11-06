import React,{ useState, useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import *as Location from 'expo-location';
import {formatTime, calculateDistance} from '../utils/runCalculations';

const RunTracker = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [distance, setDistance] = useState(0);
    const[currentLocation, setCurrentLocation] = useState(null);
    const [previousLocation, setPreviousLocation] = useState(null);


    // Request location permissions 
    useEffect(() => {
        (async () => {
            const {status} = await Location.requestForegroundPermissionsAsync();
            if(status !== 'granted'){
                alert('Permission to access location was denied');
                return;
            }
        })();
    }, []);

    //Timer Logic 
    useEffect(() => {
        let interval;
        if(isRunning){
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    //Location Tracking 
    useEffect(() => {
        let locationSubscription = null;
        
        const startWatching = async () => {
            try {
                locationSubscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        distanceInterval: 10, // Update every 10 meters
                    },
                    (location) => {
                        if (previousLocation){
                            const dist = calculateDistance(
                                previousLocation.coords,
                                location.coords
                            );
                            setDistance((prevDistance) => prevDistance + dist);
                        }
                        setPreviousLocation(location);
                        setCurrentLocation(location);
                    }
                );
            } catch (e) {
                console.warn('Failed to start location watcher', e);
            }
        };

        if(isRunning){ 
            startWatching();
        }

        return () => {
            if(locationSubscription && typeof locationSubscription.remove === 'function'){
                locationSubscription.remove();
            }
        };
    }, [isRunning, previousLocation]);

    const toggleRun = () => {
        setIsRunning(!isRunning);
    };
    
    const resetRun = () => {
        setIsRunning(false);
        setTime(0);
        setDistance(0);
        setCurrentLocation(null);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Time: {formatTime(time)}</Text>
            <Text style={styles.text}>Distance: {distance.toFixed(2)} m</Text>
            <TouchableOpacity style={styles.button} onPress={toggleRun}>
                <Text style={styles.buttonText}>{isRunning ? 'Stop' : 'Start'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.reset]} onPress={resetRun}>
                <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        marginVertical: 4,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 6,
        marginTop: 10,
    },
    reset: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default RunTracker;
