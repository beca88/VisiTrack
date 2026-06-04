const int SENSOR_PIN = 3;
const int BUZZER_PIN = 8;

void setup() {
  // put your setup code here, to run once:
  pinMode(SENSOR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.begin(9600);

  Serial.println("System Initialized...");

}

void loop() {
  if(digitalRead(SENSOR_PIN) == LOW){
    // Short chime for feedback
    digitalWrite(BUZZER_PIN, HIGH);
    delay(100); 
    digitalWrite(BUZZER_PIN, LOW);

    
    Serial.println('1'); // Sends the byte '1' to the serial monitor to indicate a person has been detected
    
    // Cooldown to prevent multiple counts for one person
    delay(3000); 
  }
}
