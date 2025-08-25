#include <bits/stdc++.h>
using namespace std;

// class Student {

// public:
//     double* salary;
//     string name;
//     int age;

//     Student(string name, int age, double* salary) : name(name), age(age), salary(salary) {}

//     Student(const Student& s) {
//         name = s.name;
//         age = s.age;
//         salary = s.salary; // Shallow copy of salary pointer
//     }

//     Student(const Student& s, bool deepCopy) {
//         name = s.name;
//         age = s.age;
//         salary = new double(*(s.salary)); // Deep copy of salary value
//     }

//     ~Student() {
//         // Only delete if memory was allocated with new
//         // (Safe to delete nullptr, but don't delete memory not owned)
//         cout<<"Destructor called for " << name << endl;
//         // If salary was allocated with new, we delete it
//         // This prevents memory leaks

//         delete salary;
//     }

//     void getinfo() {
//         cout << "Name: " << name << endl;
//         cout << "Age: " << age << endl;
//         cout << "Salary: " << *salary << endl; // Print value pointed by salary
//     }
// };



// INHERITENCE
// class Base{
//     public:
//     string name;
//     int age;
//     Base(string name, int age)
//     {   
//         this->name = name;
//         this->age = age;
//     }
// };

// class Derived : public Base{
//     public:
//     int roll ;

//     Derived(string name, int age, int roll) : Base(name, age)
//     {
//         this->roll = roll;
//     }

//     void getinfo() {
//         cout << "Name: " << name << endl;
//         cout << "Age: " << age << endl;
//         cout<< "Roll: " << roll << endl;
//     }
// };


// INHERITENCE + POLYMORPHISM (STATIC BINDING AND DYNAMIC DISPATCH) AND VIRTUAL FUNCTIONS
class Base{
    public:

    void f1(){cout<<"Base f1 non virtual"<<endl;}

    virtual void f2(){cout<<"Base f2 virtual"<<endl;}
};

class derived : public Base{
    public:

    void f1(){cout<<"derived f1 non virtual"<<endl;}

    void f2() override {cout<<"derived f2 virtual"<<endl;}
};

int main() 
{
    // double sal = 50000.0;
    // Student s1("John Doe", 20, &sal); // Pass address of salary
    // Student s2(s1, true); 

    // s1.getinfo();
    // *(s2.salary) = 100;
    // s1.getinfo();


    // Derived d1("John Doe", 20, 101);
    // d1.getinfo();
    derived d;
    Base b;

    b = d;
    b.f1();
    b.f2();


    return 0;
}