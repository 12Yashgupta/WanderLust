#include<bits/stdc++.h>
using namespace std;
void insert(int x,stack<int>&s)
{
    if(s.size()==0 || s.top()<=x)
    {
        s.push(x);
        return;
    }
    int t=s.top();
    s.pop();
    insert(x,s);
    s.push(t);
}
void Sort(stack<int>&s)
{
    if(s.size()==0)
    return;
    int x=s.top();
    s.pop();
    Sort(s);
    insert(x,s);
}
void insert_ele(int t,stack<int>&s)
{
    if(s.size()==0)
    {
        s.push(t);
        return;
    }
    int x=s.top();
    s.pop();
    insert_ele(t,s);
    s.push(x);
}
void Reverse(stack<int>&s)
{
    if(s.size()==0)
    return;

    int t=s.top();
    s.pop();
    Reverse(s);
    insert_ele(t,s);
}
void no_consecutive_1(int n,string str="")
{

    if(n==0)
    {
        cout<<str<<endl;
        return;
    }
    if(str.size()==0||str.back()=='0')
    {
        no_consecutive_1(n-1,str+'0');
        no_consecutive_1(n-1,str+'1');
    }
    else
      no_consecutive_1(n-1,str+'0');
}
int main(){
    // int n;
    // cin>>n;
    // no_consecutive_1(n);
    string s="yash";
    string s1="yash";
    cout<<s.compare(s1);
    int n=4;
    vector<string> grid(n,string(n,'.')); 
    for(int i=0;i<n;i++)
    {
        for(int j=0;j<n;j++)
        cout<<grid[i][j]<<" ";
        cout<<endl;
    }
    vector<vector<int>> arr;
    arr.push_back({1,2});
    return 0;
}